import { FormEvent, useState } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Video } from "lucide-react"

export default function LoginPage() {
  const { currentUser, login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  if (currentUser) return <Navigate to="/" replace />

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const result = login(email, password)
    if (!result.ok) setError(result.error ?? "Erreur de connexion")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Video className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl">Connexion</CardTitle>
          <CardDescription>Accédez à votre espace CRM agence</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="vous@agence.ma"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">
              Se connecter
            </Button>
          </form>
          <div className="mt-5 rounded-md bg-muted p-3 text-xs text-muted-foreground">
            <p className="mb-1 font-medium">Comptes de démonstration :</p>
            <p>admin@ → elouafiaayoub@gmail.com / admin123</p>
            <p>manager@agence.ma / manager123</p>
            <p>leader@agence.ma / leader123</p>
            <p>editor@agence.ma / editor123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
