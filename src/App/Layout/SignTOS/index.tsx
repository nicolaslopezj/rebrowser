import Button from '../../../components/ui/buttons/Button'
import {TOS} from './TOS'

export interface Props {
  setDidSign: (didSign: boolean) => void
}
export default function SignTOS(props: Props) {
  return (
    <div className="fixed inset-0 space-y-10 bg-white px-32 py-10">
      <div className="text-md font-medium">
        Please read the following terms of service to use the app.
      </div>
      <div className="max-h-52 space-y-2 overflow-auto rounded-lg bg-gray-100 p-5 font-mono text-sm">
        {TOS.split('\n').map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
      <Button primary onClick={() => props.setDidSign(true)}>
        Accept and continue
      </Button>
    </div>
  )
}
