type CardProps = React.HTMLAttributes<HTMLDivElement>

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
      {...props}
    />
  )
}

type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
}

type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3
      className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
      {...props}
    />
  )
}

type CardContentProps = React.HTMLAttributes<HTMLDivElement>

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={`p-6 pt-0 ${className}`} {...props} />
}

type CardButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'primary' | 'secondary' | 'danger'
}

export function Button({ 
  className = '', 
  variant = 'default',
  ...props 
}: CardButtonProps) {
  const baseStyles = 'px-4 py-2 rounded transition-colors font-medium'
  
  const variantStyles = {
    default: 'bg-gray-500 hover:bg-gray-600 text-white',
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-green-500 hover:bg-green-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white'
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    />
  )
}
