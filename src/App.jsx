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

// V2 new public pages
import MiddleSchoolFoundation from './pages/MiddleSchoolFoundation'
import HighSchoolPathways from './pages/HighSchoolPathways'
import Tuition from './pages/Tuition'
import AcademicCalendar from './pages/AcademicCalendar'
import ProgramCompare from './pages/ProgramCompare'
import GradeGroupPage from './pages/GradeGroupPage'

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

// Auth pages
import AuthPage from './pages/auth/AuthPage'
import AuthCallback from './pages/auth/AuthCallback'
import Register from './pages/Register'

// Auth & Storefront providers
import { AuthProvider } from './context/AuthContext'
import { StorefrontProvider } from './context/StorefrontContext'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
    return (
        <AuthProvider>
            <Routes>
                {/* Auth routes */}
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/auth/callback" element={<AuthCallback />} />

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
                                <Route path="/group/:groupSlug" element={<GradeGroupPage storefront="academic-prep" />} />
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
                                <Route path="/group/:groupSlug" element={<GradeGroupPage storefront="official-ontario" />} />
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
                                <Route path="/register" element={<Register />} />
                                <Route path="/programs/elementary" element={<PrimaryFoundation />} />

                                {/* V2 new public pages */}
                                <Route path="/programs/middle-school" element={<MiddleSchoolFoundation />} />
                                <Route path="/programs/high-school" element={<HighSchoolPathways />} />
                                <Route path="/tuition" element={<Tuition />} />
                                <Route path="/schedule" element={<AcademicCalendar />} />
                                <Route path="/compare" element={<ProgramCompare />} />

                                {/* Program-agnostic grade pages (shows both programs side by side) */}
                                <Route path="/grade/:grade" element={<GradePage />} />

                                {/* Portal pages — protected by auth */}
                                <Route path="/portal/student" element={
                                    <ProtectedRoute requiredRoles={['student', 'parent', 'admin']}>
                                        <StudentPortal />
                                    </ProtectedRoute>
                                } />
                                <Route path="/portal/parent" element={
                                    <ProtectedRoute requiredRoles={['parent', 'admin']}>
                                        <ParentPortal />
                                    </ProtectedRoute>
                                } />
                                <Route path="/portal/agent" element={
                                    <ProtectedRoute requiredRoles={['agent', 'admin']}>
                                        <AgentPortal />
                                    </ProtectedRoute>
                                } />
                            </Routes>
                        </main>
                        <Footer />
                    </>
                } />
            </Routes>
        </AuthProvider>
    )
}

export default App
