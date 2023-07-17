import {BookOpenIcon} from '@heroicons/react/24/outline'

export default function SelectATab() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-10 text-gray-500">
      <div>
        <BookOpenIcon className="w-7" />
      </div>
      <div className="text-center text-sm ">Select a tab to get started</div>
    </div>
  )
}
