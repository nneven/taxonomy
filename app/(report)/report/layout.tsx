interface ReportProps {
  children?: React.ReactNode
}

export default function ReportLayout({ children }: ReportProps) {
  return (
    <div className="container mx-auto grid min-h-dvh items-start gap-10 py-8">
      {children}
    </div>
  )
}
