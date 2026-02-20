import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ClickSpark from './components/ClickSpark/ClickSpark';
import { useTheme } from './ThemeContext';

function App() {
    const { theme } = useTheme();

    return (
        <ClickSpark
            sparkColor="#818cf8"
            sparkSize={10}
            sparkRadius={15}
            sparkCount={8}
            duration={400}
        >
            <div className={`bg-mesh ${theme === 'dark' ? 'bg-mesh--dark' : 'bg-mesh--light'}`} aria-hidden="true" />
            <Navbar />
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>
            <Footer />
        </ClickSpark>
    );
}

export default App;
