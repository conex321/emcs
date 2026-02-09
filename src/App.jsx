import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
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
import AcademicPrepLanding from './pages/AcademicPrepLanding'
import OfficialOntarioLanding from './pages/OfficialOntarioLanding'
import GradePage from './pages/GradePage'
import StorefrontCourseDetail from './pages/StorefrontCourseDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'

// Portal pages
import StudentPortal from './pages/portals/StudentPortal'
import ParentPortal from './pages/portals/ParentPortal'
import AgentPortal from './pages/portals/AgentPortal'

// Storefront provider
import { StorefrontProvider } from './context/StorefrontContext'

function App() {
    return (
        <>
            <Routes>
                {/* Backward compatibility redirects - old routes to new routes */}
                <Route path="/non-credit" element={<Navigate to="/academic-prep" replace />} />
                <Route path="/credit" element={<Navigate to="/official-ontario" replace />} />

                {/* New Program Routes - Academic Preparation Program */}
                <Route path="/academic-prep/*" element={
                    <StorefrontProvider>
                        <Header />
                        <main>
                            <Routes>
                                <Route path="/" element={<AcademicPrepLanding />} />
                                <Route path="/grade/:grade" element={<GradePage />} />
                                <Route path="/grade/:grade/courses" element={<GradePage />} />
                                <Route path="/course/:courseCode" element={<StorefrontCourseDetail />} />
                            </Routes>
                        </main>
                        <Footer />
                    </StorefrontProvider>
                } />

                {/* New Program Routes - Official Ontario Program */}
                <Route path="/official-ontario/*" element={
                    <StorefrontProvider>
                        <Header />
                        <main>
                            <Routes>
                                <Route path="/" element={<OfficialOntarioLanding />} />
                                <Route path="/grade/:grade" element={<GradePage />} />
                                <Route path="/grade/:grade/courses" element={<GradePage />} />
                                <Route path="/course/:courseCode" element={<StorefrontCourseDetail />} />
                            </Routes>
                        </main>
                        <Footer />
                    </StorefrontProvider>
                } />

                {/* Old Storefront routes (kept for backward compatibility) */}
                <Route path="/non-credit/*" element={
                    <StorefrontProvider>
                        <Header />
                        <main>
                            <Routes>
                                <Route path="/" element={<AcademicPrepLanding />} />
                                <Route path="/grade/:grade" element={<GradePage />} />
                                <Route path="/course/:courseCode" element={<StorefrontCourseDetail />} />
                            </Routes>
                        </main>
                        <Footer />
                    </StorefrontProvider>
                } />

                <Route path="/credit/*" element={
                    <StorefrontProvider>
                        <Header />
                        <main>
                            <Routes>
                                <Route path="/" element={<OfficialOntarioLanding />} />
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
                        <Header />
                        <main>
                            <Cart />
                        </main>
                        <Footer />
                    </StorefrontProvider>
                } />

                <Route path="/checkout" element={
                    <StorefrontProvider>
                        <Header />
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

                                {/* Program-agnostic grade pages (shows both programs side by side) */}
                                <Route path="/grade/:grade" element={<GradePage />} />

                                {/* Portal pages */}
                                <Route path="/portal/student" element={<StudentPortal />} />
                                <Route path="/portal/parent" element={<ParentPortal />} />
                                <Route path="/portal/agent" element={<AgentPortal />} />
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
