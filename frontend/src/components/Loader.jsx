export default function Loader({ fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border border-accent/20 rounded-full" />
        <div className="absolute inset-0 border-t border-accent rounded-full animate-spin" />
        <div className="absolute inset-2 border border-accent/10 rounded-full" />
        <div className="absolute inset-2 border-t border-glow/50 rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
      </div>
      <span className="text-muted text-xs font-mono tracking-widest">LOADING</span>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-void flex items-center justify-center z-50">
        {content}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-20">
      {content}
    </div>
  )
}
