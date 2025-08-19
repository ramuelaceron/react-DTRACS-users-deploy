import React from 'react'

const ManageAccount = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Account</h1>
      <form className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            className="w-full border p-2 rounded"
            placeholder="Enter your email"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}

export default ManageAccount
