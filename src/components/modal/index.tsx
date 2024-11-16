import { useContext, useState } from 'react'
import { Store } from '../../store'
import CopyIcon from '../icons/copy-icon'

const Modal = () => {
  const { state } = useContext(Store)
  const [showCopyClickedText, setShowCopyClickedText] = useState(false)
  const handleOnCopyClick = () => {
    setShowCopyClickedText(true)
    state.modal.onCopyClick && state.modal.onCopyClick()
    setTimeout(() => {
      setShowCopyClickedText(false)
    }, 3000)
  }
  return (
    <>
      {state.modal.showModal && (
        <div className="bg-slate-800 bg-opacity-50 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0">
          <div className="shadow-lg bg-gray-800 rounded px-20 py-16 rounded-md text-center z-10">
            {state.modal.onCopyClick ? (
              <div className="text-white flex space-x-2 items-start relative">
                <h1 className="text-l mb-4 font-bold">{state.modal.message}</h1>
                {showCopyClickedText && (
                  <span className="font-bold absolute bottom-12 right-0">
                    Copied!
                  </span>
                )}
                <button onClick={handleOnCopyClick}>
                  <CopyIcon />
                </button>
              </div>
            ) : (
              <h1 className="text-l mb-4 font-bold text-white">
                {state.modal.message}
              </h1>
            )}
            {state.modal.children ?? state.modal.children}
            <div className="flex flex-col mt-4 sm:flex-row sm:items-center sm:justify-center">
              {state.modal.onCancel && (
                <button
                  onClick={state.modal.onCancel}
                  className="flex items-center justify-center order-1 w-full px-2 py-2 mt-3 text-sm tracking-wide text-gray-600 capitalize transition-colors duration-300 transform border rounded-md sm:mx-2 dark:border-gray-400 dark:text-gray-300 sm:mt-0 sm:w-40 hover:bg-gray-50 focus:outline-none focus:ring dark:hover:bg-gray-800 focus:ring-gray-300 focus:ring-opacity-40"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={state.modal.onConfirm}
                className="w-full px-5 py-2 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-indigo-600 rounded-md sm:mx-2 sm:order-2 sm:w-40 hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-80"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Modal
