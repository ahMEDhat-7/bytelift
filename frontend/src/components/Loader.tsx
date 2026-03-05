export default function Loader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = {
    sm: 'loader-sm',
    md: 'loader-md',
    lg: 'loader-lg',
  }[size];

  return (
    <div className="loader-container">
      <div className={`loader ${sizeClass}`}></div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="page-loader">
      <div className="loader loader-lg"></div>
    </div>
  );
}
