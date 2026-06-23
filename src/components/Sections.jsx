import manWithCat from '../assets/Man with black cat.jpg'
import logo from '../assets/logo.png'
import { Mail, X, Globe } from 'lucide-react'

export function NavBar() {
  return (
    <nav className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-gray-200 bg-white">
      <img src={logo} alt="logo" className="h-8" />
      <div className="hidden md:flex items-center gap-3">
        <button className="px-5 py-2 rounded-full border border-gray-300 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50">
          Log in
        </button>
        <button className="px-5 py-2 rounded-full bg-gray-900 text-sm font-medium text-white cursor-pointer hover:bg-gray-700">
          Sign up
        </button>
      </div>
      <button className="md:hidden p-2 text-gray-700 cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </nav>
  )
}

export function HeroSection() {
  return (
    <div className="p-4 md:p-6">
      <section className="flex flex-col md:flex-row items-center gap-6 md:gap-8 bg-stone-50 rounded-3xl p-6 md:p-8 border border-gray-100">

        <div className="flex-1 flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold text-gray-900 leading-tight m-0">
            Stay Informed, Stay Inspired
          </h1>
          <p className="text-xs text-gray-400 mt-5 leading-relaxed max-w-xs md:max-w-48">
            Discover a World of Knowledge at Your Fingertips. Your Daily Dose of Inspiration and Information.
          </p>
        </div>

        <div className="flex-1 w-full">
          <img
            src={manWithCat}
            alt="Man with black cat"
            className="w-full h-64 md:h-80 object-cover rounded-3xl"
          />
        </div>

        <div className="flex-1 text-left w-full">
          <p className="text-xs text-gray-400 m-0">- Author</p>
          <h2 className="text-xl font-bold text-gray-900 mt-1 mb-3">Thompson P.</h2>
          <p className="text-sm text-gray-500 leading-relaxed m-0">
            I am a pet enthusiast and freelance writer who specializes in animal behavior and
            care. With a deep love for cats, I enjoy sharing insights on feline companionship
            and wellness.
          </p>
          <p className="text-sm text-gray-500 leading-relaxed mt-4">
            When i'm not writing, I spends time volunteering at my local animal shelter,
            helping cats find loving homes.
          </p>
        </div>

      </section>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="flex items-center justify-between px-4 md:px-8 py-4 border-t border-gray-200 bg-white mt-auto">
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">Get In Touch</span>
        <div className="flex items-center gap-2">
          <a href="#" className="p-1.5 rounded-full border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-400 transition-colors">
            <Mail size={14} />
          </a>
          <a href="#" className="p-1.5 rounded-full border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-400 transition-colors">
            <X size={14} />
          </a>
          <a href="#" className="p-1.5 rounded-full border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-400 transition-colors">
            <Globe size={14} />
          </a>
        </div>
      </div>
      <span className="text-sm text-gray-500">Home page</span>
    </footer>
  )
}
