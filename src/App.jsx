import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import StorefrontHeader from './components/StorefrontHeader'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import InternationalStudents from './pages/InternationalStudents'
import OssdRequirements from './pages/OssdRequirements'
import StudentSupport from './pages/StudentSupport'
import Faq from './pages/Faq'
import Contact from './pages/Contact'
import PrimaryFoundation from './pages/PrimaryFoundation'

// New storefront pages
import NonCreditLanding from './pages/NonCreditLanding'
import CreditLanding from './pages/CreditLanding'
import GradePage from './pages/GradePage'
import StorefrontCourseDetail from './pages/StorefrontCourseDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'

// Storefront provider
import { StorefrontProvider } from './context/StorefrontContext'

function App() {
    return (
        <>
            <Routes>
                {/* Storefront routes with StorefrontHeader */}
                <Route path="/non-credit/*" element={
                    <StorefrontProvider>
                        <StorefrontHeader />
                        <main>
                            <Routes>
                                <Route path="/" element={<NonCreditLanding />} />
                                <Route path="/grade/:grade" element={<GradePage />} />
                                <Route path="/course/:courseCode" element={<StorefrontCourseDetail />} />
                            </Routes>
                        </main>
                        <Footer />
                    </StorefrontProvider>
                } />

                <Route path="/credit/*" element={
                    <StorefrontProvider>
                        <StorefrontHeader />
                        <main>
                            <Routes>
                                <Route path="/" element={<CreditLanding />} />
                                <Route path="/grade/:grade" element={<GradePage />} />
                                <Route path="/course/:courseCode" element={<StorefrontCourseDetail />} />
                            </Routes>
                        </main>
                        <Footer />
                    </StorefrontProvider>
                } />

                {/* Cart and Checkout */}
                <Route path="/cart" element={
                    <StorefrontProvider>
                        <StorefrontHeader />
                        <main>
                            <Cart />
                        </main>
                        <Footer />
                    </StorefrontProvider>
                } />

                <Route path="/checkout" element={
                    <StorefrontProvider>
                        <StorefrontHeader />
                        <main>
                            <Checkout />
                        </main>
                        <Footer />
                    </StorefrontProvider>
                } />

                {/* Original routes with original Header */}
                <Route path="/*" element={
                    <>
                        <Header />
                        <main>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/about" element={<About />} />
                                <Route path="/courses" element={<Courses />} />
                                <Route path="/courses/:courseCode" element={<CourseDetail />} />
                                <Route path="/admissions/international" element={<InternationalStudents />} />
                                <Route path="/ossd-requirements" element={<OssdRequirements />} />
                                <Route path="/student-support" element={<StudentSupport />} />
                                <Route path="/faq" element={<Faq />} />
                                <Route path="/contact" element={<Contact />} />
                                <Route path="/programs/elementary" element={<PrimaryFoundation />} />
                            </Routes>
                        </main>
                        <Footer />
                    </>
                } />
            </Routes>
        </>
    )
}

export default App
