import './globals.css'
import Navbar from '../components/Navbar'
//import Footer from '../components/Footer'

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
