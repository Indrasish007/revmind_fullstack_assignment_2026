import logging
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from app.core.database import get_db
from app.services.chat_service import process_chat_query

# Initialize logger
logger = logging.getLogger("app.api.chat")

router = APIRouter(tags=["chat"])

class ChatRequest(BaseModel):
    question: str = Field(
        ..., 
        description="The natural language question to ask the NovaBite business intelligence chatbot.",
        example="Which region had the highest net revenue in Q1 2024?"
    )

class ChatResponse(BaseModel):
    question: str = Field(..., description="The original question asked by the user.")
    answer: str = Field(..., description="The business insights response synthesized by the LLM.")
    timestamp: str = Field(..., description="The RFC3339 timestamp of the response.")

@router.post("/chat", response_model=ChatResponse, status_code=status.HTTP_200_OK)
def post_chat_query(payload: ChatRequest, db: Session = Depends(get_db)):
    """
    Accepts a natural language question about NovaBite sales data,
    evaluates database queries, and returns a business-friendly response.
    """
    question = payload.question.strip()
    
    if not question:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Question cannot be empty or blank."
        )

    logger.info(f"Received chat query: '{question}'")
    
    try:
        # Execute the pipeline
        answer = process_chat_query(db, question)
        
        return ChatResponse(
            question=question,
            answer=answer,
            timestamp=datetime.utcnow().isoformat() + "Z"
        )
        
    except ValueError as val_err:
        # Rejections due to security or validation
        logger.warning(f"Validation failure for chat query '{question}': {str(val_err)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
        
    except RuntimeError as run_err:
        # Failures in database execution or LLM connections
        logger.error(f"Runtime error processing query '{question}': {str(run_err)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(run_err)
        )
        
    except Exception as e:
        # Unexpected server errors
        logger.error(f"Unexpected error processing chat query '{question}': {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while processing your query. Please check server logs."
        )
