'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Loader2, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  Star,
  Zap,
  Shield,
  BarChart3,
  TrendingUp,
  Globe,
  Sparkles
} from 'lucide-react'

export default function AuthPage() {
  const [mode, setMode] = useState('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)  
  const [fieldErrors, setFieldErrors] = useState({})
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  })
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [strengthLabel, setStrengthLabel] = useState('')

  const { login, signup, signInWithOAuth, loading, user } = useAuth()
  const router = useRouter()
  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    let strength = 0
    let label = 'VERY WEAK'
    
    if (password.length >= 8) strength += 20
    if (password.length >= 12) strength += 10
    if (/[A-Z]/.test(password)) strength += 20
    if (/[a-z]/.test(password)) strength += 20
    if (/\d/.test(password)) strength += 15
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 15
    
    if (strength >= 90) label = 'VERY STRONG'
    else if (strength >= 70) label = 'STRONG'
    else if (strength >= 50) label = 'MODERATE'
    else if (strength >= 30) label = 'WEAK'
    else label = 'VERY WEAK'
    
    return { strength: Math.min(strength, 100), label }
  }

  // Password validation function
  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
    setPasswordRequirements(requirements)
    
    // Calculate password strength
    const { strength, label } = calculatePasswordStrength(password)
    setPasswordStrength(strength)
    setStrengthLabel(label)
    
    return Object.values(requirements).every(Boolean)
  }

  // Form validation
  const validateForm = () => {
    const errors = {}
    
    if (!email) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Invalid email format'
    }

    if (!password) {
      errors.password = 'Password is required'
    } else if (mode === 'sign-up' && !validatePassword(password)) {
      errors.password = 'Password does not meet requirements'
    }

    if (mode === 'sign-up') {
      if (!firstName.trim()) {
        errors.firstName = 'First name is required'
      }
      if (!lastName.trim()) {
        errors.lastName = 'Last name is required'
      }
      if (!acceptTerms) {
        errors.terms = 'You must accept the terms and conditions'
      }
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }
  // Handle password change with validation
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    if (mode === 'sign-up' && newPassword) {
      validatePassword(newPassword)
    }
    // Clear password error when user starts typing
    if (fieldErrors.password) {
      setFieldErrors(prev => ({ ...prev, password: '' }))
    }
  }

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  // Clear form and messages when switching modes
  useEffect(() => {
    setEmail('')
    setPassword('')
    setFirstName('')
    setLastName('')
    setError('')
    setSuccess('')
    setShowPassword(false)
  }, [mode])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setFieldErrors({})

    // Validate form
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      if (mode === 'sign-in') {
        const result = await login(email, password)
        if (result.success) {
          setSuccess('SIGNED IN SUCCESSFULLY')
          setTimeout(() => router.push('/dashboard'), 1500)
        } else {
          setError(result.error)
        }
      } else {
        const result = await signup({
          email,
          password,
          firstName: firstName.trim(),
          lastName: lastName.trim()
        })
        
        if (result.success) {
          if (result.verificationRequired) {
            setSuccess('VERIFICATION EMAIL SENT - CHECK YOUR INBOX')
          } else {
            setSuccess('ACCOUNT CREATED SUCCESSFULLY')
            setTimeout(() => router.push('/dashboard'), 1500)
          }
        } else {
          setError(result.error)
        }
      }
    } catch (error) {
      setError('SYSTEM ERROR - PLEASE TRY AGAIN')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOAuthSignIn = async (provider) => {
    try {
      const result = await signInWithOAuth(provider)
      if (!result.success) {
        setError(result.error)
      }
    } catch (error) {
      setError(`Failed to sign in with ${provider}`)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono overflow-hidden">
      {/* Minimal Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:32px_32px]" />
      
      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Bento Grid Layout */}
        <div className="hidden lg:flex lg:w-3/5 flex-col justify-center p-12 xl:p-16">
          <div className="max-w-2xl">
            {/* Header */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-white flex items-center justify-center">
                  <div className="w-4 h-4 bg-black" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">AI DASHBOARD</h1>
                  <p className="text-zinc-500 text-xs uppercase tracking-wider">Investment Analytics Platform</p>
                </div>
              </div>
              
              <h2 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight tracking-tight">
                PROFESSIONAL
                <br />
                INVESTMENT
                <br />
                <span className="text-zinc-400">ANALYTICS</span>
              </h2>
              
              <p className="text-zinc-400 text-lg leading-relaxed max-w-lg">
                Enterprise-grade investment analysis platform powered by artificial intelligence. 
                Make data-driven decisions with institutional-quality research tools.
              </p>
            </div>

            {/* Bento Grid Features */}
            <div className="grid grid-cols-2 gap-4 mb-12">
              {/* Large Feature Card */}
              <div className="col-span-2 p-6 border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">REAL-TIME ANALYTICS</h3>
                    <p className="text-zinc-400 text-sm">Live market data processing with sub-second latency</p>
                  </div>
                  <div className="w-8 h-8 border border-zinc-700 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">99.9%</div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">150ms</div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider">Latency</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider">Monitoring</div>
                  </div>
                </div>
              </div>

              {/* Security Card */}
              <div className="p-6 border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <Shield className="h-6 w-6" />
                  <div className="text-xs text-zinc-500 uppercase tracking-wider">Security</div>
                </div>
                <h3 className="text-lg font-semibold mb-2">BANK-GRADE</h3>
                <p className="text-zinc-400 text-sm">SOC 2 Type II certified infrastructure</p>
              </div>

              {/* Performance Card */}
              <div className="p-6 border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <Zap className="h-6 w-6" />
                  <div className="text-xs text-zinc-500 uppercase tracking-wider">Performance</div>
                </div>
                <h3 className="text-lg font-semibold mb-2">LIGHTNING</h3>
                <p className="text-zinc-400 text-sm">Optimized for high-frequency analysis</p>
              </div>

              {/* Global Card */}
              <div className="p-6 border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <Globe className="h-6 w-6" />
                  <div className="text-xs text-zinc-500 uppercase tracking-wider">Coverage</div>
                </div>
                <h3 className="text-lg font-semibold mb-2">GLOBAL</h3>
                <p className="text-zinc-400 text-sm">60+ international exchanges</p>
              </div>

              {/* API Card */}
              <div className="p-6 border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <BarChart3 className="h-6 w-6" />
                  <div className="text-xs text-zinc-500 uppercase tracking-wider">Integration</div>
                </div>
                <h3 className="text-lg font-semibold mb-2">API FIRST</h3>
                <p className="text-zinc-400 text-sm">RESTful and GraphQL endpoints</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 text-sm text-zinc-500 uppercase tracking-wider">
              <div>
                <span className="text-white font-bold">10,000+</span> Active Users
              </div>
              <div>
                <span className="text-white font-bold">$50B+</span> Assets Tracked
              </div>
              <div>
                <span className="text-white font-bold">99.9%</span> Accuracy
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex-1 lg:w-2/5 flex items-center justify-center p-8 lg:p-12 border-l border-zinc-800">
          <div className="w-full max-w-sm">
            {/* Mobile Header */}
            <div className="lg:hidden mb-12 text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-6 h-6 bg-white flex items-center justify-center">
                  <div className="w-3 h-3 bg-black" />
                </div>
                <h1 className="text-xl font-bold tracking-tight">AI DASHBOARD</h1>
              </div>
              <p className="text-zinc-400 text-sm">Professional Investment Analytics</p>
            </div>

            {/* Mode Toggle */}
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-px border border-zinc-800 bg-zinc-800">
                <Button
                  type="button"
                  variant="ghost"
                  className={`h-12 font-mono text-xs uppercase tracking-wider border-0 rounded-none transition-all duration-200 ${
                    mode === 'sign-in' 
                      ? 'bg-white text-black hover:bg-zinc-100' 
                      : 'bg-black text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                  onClick={() => setMode('sign-in')}
                  disabled={isSubmitting}
                >
                  Sign In
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className={`h-12 font-mono text-xs uppercase tracking-wider border-0 rounded-none transition-all duration-200 ${
                    mode === 'sign-up' 
                      ? 'bg-white text-black hover:bg-zinc-100' 
                      : 'bg-black text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                  onClick={() => setMode('sign-up')}
                  disabled={isSubmitting}
                >
                  Sign Up
                </Button>
              </div>
            </div>

            {/* Success/Error Messages */}
            {success && (
              <div className="mb-6 p-4 border border-zinc-600 bg-zinc-900/50">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{success}</span>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 border border-zinc-600 bg-zinc-900/50">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}            
            
            {/* Auth Form */}
            <div className="border border-zinc-800 bg-zinc-950/50">
              <div className="p-6 border-b border-zinc-800">
                <h2 className="text-lg font-semibold uppercase tracking-wider">
                  {mode === 'sign-in' ? 'Access Account' : 'Create Account'}
                </h2>
                <p className="text-zinc-400 text-sm mt-1">
                  {mode === 'sign-in' 
                    ? 'Enter your credentials to continue' 
                    : 'Join the platform for institutional-grade analytics'
                  }
                </p>
              </div>
              
              <div className="p-6 space-y-8">                {/* OAuth Buttons */}
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-14 border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-900 hover:text-white hover:border-zinc-600 font-mono text-xs uppercase tracking-wider transition-all duration-300 group"
                    onClick={() => handleOAuthSignIn('google')}
                    disabled={loading || isSubmitting}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <svg className="w-5 h-5 transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"/>
                      </svg>
                      <span>Continue with Google</span>
                    </div>
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-14 border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-900 hover:text-white hover:border-zinc-600 font-mono text-xs uppercase tracking-wider transition-all duration-300 group"
                    onClick={() => handleOAuthSignIn('github')}
                    disabled={loading || isSubmitting}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <svg className="w-5 h-5 transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <span>Continue with GitHub</span>
                    </div>
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-zinc-800" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-zinc-950 px-6 text-zinc-500 font-mono text-xs uppercase tracking-wider">
                      Or use email
                    </span>
                  </div>
                </div>

                {/* Email/Password Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {mode === 'sign-up' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Label htmlFor="firstName" className="text-zinc-400 font-mono text-xs uppercase tracking-wider block">
                          First Name *
                        </Label>                        <div className="relative group">
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="JOHN"
                            value={firstName}
                            onChange={(e) => {
                              setFirstName(e.target.value)
                              if (fieldErrors.firstName) {
                                setFieldErrors(prev => ({ ...prev, firstName: '' }))
                              }
                            }}
                            className={`h-14 bg-transparent text-white placeholder-zinc-600 font-mono uppercase transition-all duration-300 group-hover:border-zinc-600 ${
                              fieldErrors.firstName 
                                ? 'border-red-500 focus:border-red-400 focus:ring-red-400/20' 
                                : 'border-zinc-700 focus:border-white focus:ring-white/20'
                            }`}
                            required={mode === 'sign-up'}
                            aria-invalid={!!fieldErrors.firstName}
                            aria-describedby={fieldErrors.firstName ? "firstName-error" : undefined}
                          />
                          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                        </div>
                        {fieldErrors.firstName && (
                          <p id="firstName-error" className="text-red-400 text-xs font-mono uppercase tracking-wider flex items-center gap-2">
                            <AlertCircle className="h-3 w-3" />
                            {fieldErrors.firstName}
                          </p>
                        )}
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="lastName" className="text-zinc-400 font-mono text-xs uppercase tracking-wider block">
                          Last Name *
                        </Label>                        <div className="relative group">
                          <Input
                            id="lastName"
                            type="text"
                            placeholder="DOE"
                            value={lastName}
                            onChange={(e) => {
                              setLastName(e.target.value)
                              if (fieldErrors.lastName) {
                                setFieldErrors(prev => ({ ...prev, lastName: '' }))
                              }
                            }}
                            className={`h-14 bg-transparent text-white placeholder-zinc-600 font-mono uppercase transition-all duration-300 group-hover:border-zinc-600 ${
                              fieldErrors.lastName 
                                ? 'border-red-500 focus:border-red-400 focus:ring-red-400/20' 
                                : 'border-zinc-700 focus:border-white focus:ring-white/20'
                            }`}
                            required={mode === 'sign-up'}
                            aria-invalid={!!fieldErrors.lastName}
                            aria-describedby={fieldErrors.lastName ? "lastName-error" : undefined}
                          />
                          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                        </div>
                        {fieldErrors.lastName && (
                          <p id="lastName-error" className="text-red-400 text-xs font-mono uppercase tracking-wider flex items-center gap-2">
                            <AlertCircle className="h-3 w-3" />
                            {fieldErrors.lastName}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                    <div className="space-y-3">
                    <Label htmlFor="email" className="text-zinc-400 font-mono text-xs uppercase tracking-wider block">
                      Email Address *
                    </Label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                        <Mail className="h-4 w-4 text-zinc-500 group-focus-within:text-zinc-400 transition-colors duration-300" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="USER@COMPANY.COM"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          if (fieldErrors.email) {
                            setFieldErrors(prev => ({ ...prev, email: '' }))
                          }
                        }}
                        className={`h-14 bg-transparent text-white placeholder-zinc-600 font-mono pl-12 transition-all duration-300 group-hover:border-zinc-600 ${
                          fieldErrors.email 
                            ? 'border-red-500 focus:border-red-400 focus:ring-red-400/20' 
                            : 'border-zinc-700 focus:border-white focus:ring-white/20'
                        }`}
                        required
                        aria-invalid={!!fieldErrors.email}
                        aria-describedby={fieldErrors.email ? "email-error" : undefined}
                      />
                      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                    </div>
                    {fieldErrors.email && (
                      <p id="email-error" className="text-red-400 text-xs font-mono uppercase tracking-wider flex items-center gap-2">
                        <AlertCircle className="h-3 w-3" />
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-zinc-400 font-mono text-xs uppercase tracking-wider block">
                      Password *
                    </Label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                        <Lock className="h-4 w-4 text-zinc-500 group-focus-within:text-zinc-400 transition-colors duration-300" />
                      </div>                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        value={password}
                        onChange={handlePasswordChange}
                        className={`h-14 bg-transparent text-white placeholder-zinc-600 font-mono pl-12 pr-14 transition-all duration-300 group-hover:border-zinc-600 ${
                          fieldErrors.password 
                            ? 'border-red-500 focus:border-red-400 focus:ring-red-400/20' 
                            : 'border-zinc-700 focus:border-white focus:ring-white/20'
                        }`}
                        required
                        minLength={mode === 'sign-up' ? 8 : undefined}
                        aria-invalid={!!fieldErrors.password}
                        aria-describedby={fieldErrors.password ? "password-error" : undefined}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all duration-300"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                    </div>                    {mode === 'sign-up' && (
                      <div className="space-y-4 mt-3">
                        {/* Password Strength Meter */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">
                              Password Strength:
                            </p>
                            <span className={`font-mono text-xs uppercase tracking-wider transition-all duration-300 ${
                              passwordStrength >= 90 ? 'text-green-400' :
                              passwordStrength >= 70 ? 'text-yellow-400' :
                              passwordStrength >= 50 ? 'text-orange-400' :
                              passwordStrength >= 30 ? 'text-red-400' :
                              'text-zinc-600'
                            }`}>
                              {strengthLabel}
                            </span>
                          </div>
                          
                          {/* Strength Bar */}
                          <div className="relative h-2 bg-zinc-800 overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ease-out ${
                                passwordStrength >= 90 ? 'bg-green-400' :
                                passwordStrength >= 70 ? 'bg-yellow-400' :
                                passwordStrength >= 50 ? 'bg-orange-400' :
                                passwordStrength >= 30 ? 'bg-red-400' :
                                'bg-zinc-600'
                              }`}
                              style={{ width: `${passwordStrength}%` }}
                            />
                            
                            {/* Strength Indicator SVG */}
                            <div className="absolute inset-0 flex items-center justify-end pr-1">
                              <svg 
                                width="8" 
                                height="8" 
                                viewBox="0 0 8 8" 
                                className={`transition-all duration-300 ${
                                  passwordStrength >= 70 ? 'opacity-100' : 'opacity-0'
                                }`}
                              >
                                <circle 
                                  cx="4" 
                                  cy="4" 
                                  r="2" 
                                  fill="white" 
                                  className="animate-pulse"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Password Requirements */}
                        <div className="space-y-2">
                          <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">
                            Requirements:
                          </p>
                          <div className="grid grid-cols-1 gap-1">
                            <div className={`flex items-center gap-2 text-xs font-mono transition-all duration-300 ${
                              passwordRequirements.length ? 'text-green-400' : 'text-zinc-600'
                            }`}>
                              {passwordRequirements.length ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                <div className="w-3 h-3 border border-current rounded-full" />
                              )}
                              Minimum 8 characters
                            </div>
                            <div className={`flex items-center gap-2 text-xs font-mono transition-all duration-300 ${
                              passwordRequirements.uppercase ? 'text-green-400' : 'text-zinc-600'
                            }`}>
                              {passwordRequirements.uppercase ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                <div className="w-3 h-3 border border-current rounded-full" />
                              )}
                              One uppercase letter
                            </div>
                            <div className={`flex items-center gap-2 text-xs font-mono transition-all duration-300 ${
                              passwordRequirements.lowercase ? 'text-green-400' : 'text-zinc-600'
                            }`}>
                              {passwordRequirements.lowercase ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                <div className="w-3 h-3 border border-current rounded-full" />
                              )}
                              One lowercase letter
                            </div>
                            <div className={`flex items-center gap-2 text-xs font-mono transition-all duration-300 ${
                              passwordRequirements.number ? 'text-green-400' : 'text-zinc-600'
                            }`}>
                              {passwordRequirements.number ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                <div className="w-3 h-3 border border-current rounded-full" />
                              )}
                              One number
                            </div>
                            <div className={`flex items-center gap-2 text-xs font-mono transition-all duration-300 ${
                              passwordRequirements.special ? 'text-green-400' : 'text-zinc-600'
                            }`}>
                              {passwordRequirements.special ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                <div className="w-3 h-3 border border-current rounded-full" />
                              )}
                              One special character
                            </div>
                          </div>                        </div>
                      </div>
                    )}                    
                    {fieldErrors.password && (
                      <p id="password-error" className="text-red-400 text-xs font-mono uppercase tracking-wider flex items-center gap-2">
                        <AlertCircle className="h-3 w-3" />
                        {fieldErrors.password}
                      </p>
                    )}
                  </div>

                  {mode === 'sign-up' && (
                    <div className="p-4 border border-zinc-800 bg-zinc-900/30">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="terms"
                          required
                          className="mt-1 w-4 h-4 bg-transparent border border-zinc-600 rounded-sm checked:bg-white checked:border-white focus:ring-1 focus:ring-white/20 transition-all duration-300"
                        />
                        <label htmlFor="terms" className="text-xs font-mono text-zinc-400 leading-relaxed">
                          I agree to the{' '}
                          <a href="#" className="text-white hover:text-zinc-300 underline transition-colors">
                            Terms of Service
                          </a>{' '}
                          and{' '}
                          <a href="#" className="text-white hover:text-zinc-300 underline transition-colors">
                            Privacy Policy
                          </a>
                        </label>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-14 bg-white text-black hover:bg-zinc-200 font-mono text-sm uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                    disabled={isSubmitting || loading}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-3">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>{mode === 'sign-in' ? 'Authenticating...' : 'Creating Account...'}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <span>{mode === 'sign-in' ? 'Access Dashboard' : 'Create Account'}</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </Button>

                  {mode === 'sign-in' && (
                    <div className="text-center pt-2">
                      <button
                        type="button"
                        className="text-zinc-400 hover:text-white font-mono text-xs uppercase tracking-wider underline underline-offset-4 transition-colors duration-300"
                        onClick={() => {
                          setError('Password recovery feature coming soon')
                        }}
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">
                {mode === 'sign-in' ? "Need an account?" : "Have an account?"}
                <button
                  onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}
                  className="ml-2 text-white hover:text-zinc-300 underline transition-colors duration-200"
                >
                  {mode === 'sign-in' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>

            {/* Mobile Features */}
            <div className="lg:hidden mt-12 space-y-4">
              <h3 className="text-center font-mono text-xs uppercase tracking-wider text-zinc-400 mb-6">Platform Features</h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { icon: TrendingUp, title: "Real-time Analytics", desc: "Live market data" },
                  { icon: Shield, title: "Enterprise Security", desc: "Bank-grade protection" },
                  { icon: Zap, title: "High Performance", desc: "Sub-second latency" }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border border-zinc-800 bg-zinc-950/50">
                    <div className="w-8 h-8 border border-zinc-700 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-mono text-sm font-semibold">{feature.title}</div>
                      <div className="font-mono text-xs text-zinc-400">{feature.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Powered by */}
            <div className="mt-12 text-center">
              <div className="font-mono text-xs text-zinc-600 items-center justify-center align-middle flex uppercase tracking-wider">
                Powered by <span className="mx-1">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="15" height="15" viewBox="0 0 48 48"><g id="Ð¡Ð»Ð¾Ð¹_1"><linearGradient id="SVGID_1__sH0rW2TvYdr9_gr1" x1="14.073" x2="14.073" y1="8.468" y2="36.033" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#7dffce"></stop><stop offset="1" stop-color="#50c08d"></stop></linearGradient><path fill="url(#SVGID_1__sH0rW2TvYdr9_gr1)" d="M24.2,30V6.3c0-1.8-2.3-2.6-3.4-1.2L4.5,25.9c-1.3,1.7-0.1,4.1,2,4.1H24.2z"></path><linearGradient id="SVGID_00000140728474547789280440000018204366184369975479__sH0rW2TvYdr9_gr2" x1="34.249" x2="34.249" y1="48.404" y2="19.425" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#7dffce"></stop><stop offset="1" stop-color="#50c08d"></stop></linearGradient><path fill="url(#SVGID_00000140728474547789280440000018204366184369975479__sH0rW2TvYdr9_gr2)" d="M24,18.4v23.7c0,1.8,2.4,2.6,3.5,1.2 l16.4-20.7c1.3-1.7,0.1-4.1-2.1-4.1H24z"></path></g>
                </svg> </span> Supabase
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
