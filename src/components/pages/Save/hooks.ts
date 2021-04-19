import { createToggleContext } from '../../../hooks/createToggleContext';

const [useOnboarding, OnboardingProvider] = createToggleContext(false);

export { useOnboarding, OnboardingProvider };
