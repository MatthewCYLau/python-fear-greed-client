import { FC } from 'react'

interface Props {
  name: string
  email: string
}

const UserCard: FC<Props> = ({ name, email }) => {
  return (
    <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row mb-5 items-center md:space-x-2 group transition duration-150 ease-linear rounded-lg group w-full py-3 px-2">
      <div>
        <img
          className="rounded-full w-10 h-10 relative object-cover"
          src="https://img.freepik.com/free-photo/no-problem-concept-bearded-man-makes-okay-gesture-has-everything-control-all-fine-gesture-wears-spectacles-jumper-poses-against-pink-wall-says-i-got-this-guarantees-something_273609-42817.jpg?w=1800&t=st=1669749937~exp=1669750537~hmac=4c5ab249387d44d91df18065e1e33956daab805bee4638c7fdbf83c73d62f125"
          alt=""
        />
      </div>
      <div>
        <p className="font-medium leading-4">{name}</p>
        <span className="text-xs text-slate-400">{email}</span>
      </div>
    </div>
  )
}

export default UserCard
