import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';

export default function ChangeThemeButton() {
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="absolute top-0 right-0 m-8"
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
}
