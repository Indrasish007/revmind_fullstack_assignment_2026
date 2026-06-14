/**
 * Reusable Section Header Component
 * @param {object} props
 * @param {string} props.title - Main title text
 * @param {string} [props.description] - Optional sub-description text
 * @param {React.ReactNode} [props.children] - Optional trailing action buttons or elements
 */
export default function SectionHeader({ title, description, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-slate-400 mt-1">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2 self-start sm:self-center">
          {children}
        </div>
      )}
    </div>
  );
}
