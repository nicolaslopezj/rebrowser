import {useState} from 'react'
import {Field, Form, WithValue} from 'simple-react-form'
import {electronAPI} from '../../api'
import Button from '../../components/ui/buttons/Button'
import {ButtonClickResponseAction} from '../../components/ui/buttons/Button/responseAction'
import TextButton from '../../components/ui/buttons/TextButton'
import ArrayField from '../../components/ui/fields/ArrayComponent'
import PasswordInput from '../../components/ui/fields/Password'
import TextInput from '../../components/ui/fields/TextInput'
import SpinnerLoading from '../../components/ui/loadings/Spinner'
import AppVersion from './Version'
import {useConfig} from './types'

export default function ConfigIndex() {
  const {config, setConfig} = useConfig()
  const [showDetails, setShowDetails] = useState(false)
  if (!config) {
    return (
      <div className="flex items-center justify-center p-5">
        <SpinnerLoading />
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-10 bg-gray-50 p-5">
      <div className="space-y-5">
        <div className="space-x-2">
          <Button primary onClick={() => electronAPI.restartApp()}>
            Restart
          </Button>
          <Button primary onClick={() => electronAPI.resetAllNavigationStorageAndCache()}>
            Reset caché
          </Button>
        </div>
        <AppVersion />
      </div>
      <Form state={config} onChange={setConfig} onSubmit={() => alert('submit')}>
        <div className="space-y-5">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
            Auto config string
          </label>
          <div className="flex space-x-5">
            <div className="flex-1">
              <Field
                fieldName="autoConfigString"
                placeholder="Leave empty for default"
                description="Set an auto config string to automatically configure the app"
                type={TextInput}
              />
            </div>
            <div className="f">
              <Button
                buttonType="button"
                onClick={async () => {
                  try {
                    await electronAPI.testAutoConfigString()
                    alert('Test successful')
                  } catch (error) {
                    alert(error)
                    return ButtonClickResponseAction.error
                  }
                }}
                primary
              >
                Test
              </Button>
            </div>
          </div>
          {showDetails ? (
            <WithValue>
              {value => {
                if (value.autoConfigString) {
                  return (
                    <div>
                      <div>Your config is imported by the auto config string.</div>
                      <pre className="text-xs">{JSON.stringify(value.pages, null, 2)}</pre>
                    </div>
                  )
                }
                return (
                  <Field fieldName="pages" type={ArrayField}>
                    <div className="grid grid-cols-2 gap-5">
                      <Field
                        fieldName="name"
                        placeholder="Example"
                        description="Name of the tab"
                        label="Name"
                        type={TextInput}
                      />
                      <Field
                        fieldName="startURL"
                        placeholder="https://example.com"
                        description="URL of the website"
                        label="URL"
                        type={TextInput}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-5">
                      <Field
                        fieldName="endpointURL"
                        placeholder="https://mydomain.com/api"
                        description="URL of the endpoint to send data"
                        label="Server URL"
                        type={TextInput}
                      />
                      <Field
                        fieldName="endpointAuthenticationToken"
                        placeholder="1234567890"
                        description="Authentication token for the endpoint"
                        label="Authentication Token"
                        type={PasswordInput}
                      />
                      <Field
                        fieldName="partition"
                        placeholder="Leave empty for default"
                        description="The data partition to use for the tab"
                        label="Storage Partition"
                        type={TextInput}
                      />
                    </div>
                  </Field>
                )
              }}
            </WithValue>
          ) : (
            <div>
              <TextButton onClick={() => setShowDetails(true)}>Show advanced config</TextButton>
            </div>
          )}
        </div>
      </Form>
    </div>
  )
}
