import React from 'react'

export default function Navbar() {
    return (
        <div className="w-full">


<nav className="bg-white border border-blue w-full">
    <div className="flex flex-wrap items-left p-5 border border-gray-200 w-full">
        <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="https://thepric.com/wp-content/uploads/2021/08/play_store_512-removebg-preview-1.png" className="h-10" alt="Flowbite Logo" />
            <span className="text-3xl font-semibold whitespace-nowrap dark:text-white">Pric</span>
        </a>
    </div>
</nav>

        </div>
    )
}
