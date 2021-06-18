import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ChallengesContext } from './ChallengesContext';
interface CountdownContextData {
    minutes: number;
    seconds: number;
    hasFinished: boolean;
    isActive: boolean;
    startCountdown: () => void;
    resetCountdown: () => void;


}
let countdowndTimeout: NodeJS.Timeout;

interface CountdownProviderProps {
    children: ReactNode;
}

export const CountdownContext = createContext({} as CountdownContextData);

export function CountdownProvider({ children }: CountdownProviderProps) {
    const { startNewChallenge } = useContext(ChallengesContext);

    const TotalMinutes = 1; // variavel que define quantos minutos de foco

    const [time, setTime] = useState(TotalMinutes * 60);
    const [isActive, setIsActive] = useState(false);
    const [hasFinished, sethasFinished] = useState(false);

    const minutes = Math.floor(time / 60)  /** Arredonda para baixo */;
    const seconds = time % 60;

    function startCountdown() {
        setIsActive(true);
    }

    function resetCountdown() {
        clearTimeout(countdowndTimeout);//impede a execução após clicar 
        setIsActive(false);
        sethasFinished(false);
        setTime(TotalMinutes * 60);
    }


    useEffect(() => {
        if (isActive && time > 0) {
            countdowndTimeout = setTimeout(() => {
                setTime(time - 1);
            }, 1000)
        } else if (isActive && time == 0) {
            // Timer chega em 0 
            sethasFinished(true);
            setIsActive(false);
            startNewChallenge();
        }
    }, [isActive, time])


    return (
        <CountdownContext.Provider value={{
            minutes,
            seconds,
            hasFinished,
            isActive,
            startCountdown,
            resetCountdown
        }}>
            {children}
        </CountdownContext.Provider>
    )
}