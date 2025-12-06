import { useState } from 'react';
import { SearchSimulator } from './features/search/SearchSimulator';
import { ComparisonMode } from './features/search/ComparisonMode';
import { Button } from './components/Button';
import styles from './App.module.css';
import './theme.css';

type Mode = 'single' | 'comparison';

function App() {
  const [mode, setMode] = useState<Mode>('single');

  return (
    <div className={styles.app}>
      <div className={styles.modeToggle}>
        <Button
          variant={mode === 'single' ? 'primary' : 'outline'}
          onClick={() => setMode('single')}
        >
          シングルモード
        </Button>
        <Button
          variant={mode === 'comparison' ? 'primary' : 'outline'}
          onClick={() => setMode('comparison')}
        >
          比較モード
        </Button>
      </div>

      {mode === 'single' ? <SearchSimulator /> : <ComparisonMode />}
    </div>
  );
}

export default App;
