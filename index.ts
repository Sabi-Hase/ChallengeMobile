import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent registra o componente raiz do app,
// garantindo que o ambiente esteja configurado corretamente,
// seja no Expo Go ou em uma build nativa
registerRootComponent(App);
