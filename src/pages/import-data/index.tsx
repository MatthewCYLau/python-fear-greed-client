import { ReactElement, useState, ChangeEvent, useEffect } from 'react'
import api from '../../utils/api'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout'
interface Values {
  objectUrl: string
}

const ImportDataPage = (): ReactElement => {
  const navigate = useNavigate()
  const [formValues, setFormValues] = useState<Values>({
    objectUrl: ''
  })
  const [file, setFile] = useState<File>()

  const uploadFile = async () => {
    const formData = new FormData()
    if (file) {
      formData.append('file', file)
      const { data } = await api.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/upload-file`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      setFormValues({ objectUrl: data.asset_url })
    }
  }

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      await api.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/records/import-from-csv`,
        formValues,
        {
          headers: {
            'content-type': 'application/json'
          }
        }
      )
      navigate('/dashboard')
    } catch (err) {
      console.log(err)
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  useEffect(() => {
    uploadFile()
  }, [file])

  return (
    <Layout>
      <div className="m-7 w-1/2">
        <h1 className="font-bold py-4 uppercase">Import Data</h1>
        <form onSubmit={submitHandler}>
          <div className="mb-6">
            <label
              className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
              htmlFor="file_input"
            >
              Upload CSV
            </label>
            <input
              className="mb-4 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              id="file_input"
              type="file"
              onChange={handleFileChange}
            />
            <button
              disabled={!formValues.objectUrl}
              type="submit"
              className="w-full px-3 py-4 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none disabled:opacity-75"
            >
              Import Data
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default ImportDataPage
