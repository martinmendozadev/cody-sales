import { AppButton } from './components/ui/AppButton';
import { ProgressBar } from './components/ui/ProgressBar';
import { Badge } from './components/ui/Badge';

function App() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-heading-md">Test de Componentes</h1>

      <div className="space-x-4">
        <AppButton variant="primary">Guardar Venta</AppButton>
        <AppButton variant="outline" isLoading>Cargando</AppButton>
      </div>

      <div className="max-w-md space-y-2">
        <p className="text-body-sm font-semibold">Progreso Mensual (60%)</p>
        <ProgressBar percentage={60} />
      </div>

      <div className="space-x-2">
        <Badge variant="warning">Hito 50%</Badge>
        <Badge variant="success">Meta Alcanzada</Badge>
      </div>
    </div>
  )
}

export default App;
