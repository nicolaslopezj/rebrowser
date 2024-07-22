import classNames from 'classnames'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

export interface Props {
  children: React.ReactNode
  onClick?: () => any
  to?: string
  disabled?: boolean
  loading?: boolean
  // desing
  className?: string
  style?: 'primary' | 'inherit' | 'danger' | 'secondary' | 'light'
  confirmText?: React.ReactNode
}

export default function TextButton(props: Props) {
  const [loadingState, setLoading] = useState(false)
  const navigate = useNavigate()
  const loading = props.loading || loadingState
  const [confirm, setConfirm] = useState(false)

  const onClick = async () => {
    if (props.disabled || loading) return

    if (props.confirmText) {
      if (confirm) {
        setConfirm(false)
      } else {
        setConfirm(true)
        return
      }
    }

    if (props.onClick) {
      setLoading(true)
      await props.onClick()
      setLoading(false)
    } else if (props.to) {
      navigate(props.to)
    }
  }

  const style = props.style || 'primary'

  const className = classNames(
    {
      'text-blue-600': style === 'primary',
      '': style === 'inherit',
      'text-red-600': style === 'danger',
      'text-stone-600 dark:text-stone-400': style === 'secondary' || style === 'light',
      'text-sm font-medium': true,
      'transition ease-in-out duration-150': true,
      'cursor-not-allowed': props.disabled,
      'text-stone-400': props.disabled,
      'opacity-50': loading,
      'hover:opacity-50 cursor-pointer': !props.disabled && !loading,
    },
    props.className,
  )
  return (
    <button type="button" className={className} onClick={onClick}>
      {confirm ? props.confirmText : props.children}
    </button>
  )
}
