import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FreelanceProfile = () => {
  return (
    <form>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
              
            {/* Card Profil */}
            <Card className="overflow-hidden py-0">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex-shrink-0 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" 
                      alt="Fanny Blas" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">Ryan Malonzo</h3>
                    <p className="text-gray-600 mb-2">Développeur backend | Ingénieur DevSecOps</p>
                    <div className="flex items-center text-gray-500 text-sm mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      Paris, France
                    </div>
                    <Badge className="text-white" style={{backgroundColor: '#FF4D6D'}}>Freelance</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card Statistiques */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold">Statistiques</CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Année</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Revenus de cette année</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-gray-900">€108.9k</span>
                    <div className="flex items-center text-green-600 text-sm">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span>2.3%</span>
                    </div>
                  </div>
                </div>
                
                {/* Graphique simulé */}
                <div className="relative h-48 bg-gradient-to-t from-purple-200 to-purple-100 rounded-lg overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                    <path
                      d="M0,120 Q50,100 100,110 T200,90 T300,70 T400,80"
                      fill="none"
                      stroke="rgb(147, 51, 234)"
                      strokeWidth="2"
                    />
                    <path
                      d="M0,120 Q50,100 100,110 T200,90 T300,70 T400,80 L400,200 L0,200 Z"
                      fill="url(#gradient)"
                      fillOpacity="0.3"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{stopColor: 'rgb(147, 51, 234)', stopOpacity: 0.4}} />
                        <stop offset="100%" style={{stopColor: 'rgb(147, 51, 234)', stopOpacity: 0.1}} />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Point avec tooltip */}
                  <div className="absolute top-6 right-16">
                    <div className="bg-black text-white px-3 py-2 rounded-lg text-sm relative">
                      <span className="text-xs text-gray-300">807 missions</span>
                      <br />
                      <span className="font-semibold">€5,569</span>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Labels des mois */}
                  <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4 text-xs text-gray-500">
                    {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map((month) => (
                      <span key={month}>{month}</span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card Compétences */}
            <Card className='p-0'>
              <div className="px-6 py-4 rounded-t-lg" style={{backgroundColor: '#FF4D6D'}}>
                <h2 className="text-white font-semibold text-lg">Compétences</h2>
              </div>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-3">
                  <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200">
                    React
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200">
                    NestJS
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200">
                    Python
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200">
                    NodeJS
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200">
                    TailwindCSS
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200">
                    Angular
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Card formulaire informations */}
          <div className="space-y-6">
            <Card className='p-0'>
              <div className="px-6 py-4 rounded-t-xl" style={{backgroundColor: '#FF4D6D'}}>
                <h2 className="text-white font-semibold text-lg">Informations</h2>
              </div>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="prenom" className="text-sm font-medium text-gray-700">
                    Prénom
                  </Label>
                  <Input 
                    id="prenom" 
                    name='prenom'
                    type="text" 
                    className="w-full bg-gray-100 border-0 focus:bg-white focus:ring-2 focus:ring-pink-500" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nom" className="text-sm font-medium text-gray-700">
                    Nom
                  </Label>
                  <Input 
                    id="nom" 
                    name='nom'
                    type="text" 
                    className="w-full bg-gray-100 border-0 focus:bg-white focus:ring-2 focus:ring-pink-500" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lieu" className="text-sm font-medium text-gray-700">
                    Lieu
                  </Label>
                  <Input 
                    id="lieu" 
                    name='lieu'
                    type="text" 
                    className="w-full bg-gray-100 border-0 focus:bg-white focus:ring-2 focus:ring-pink-500" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="poste" className="text-sm font-medium text-gray-700">
                    Poste
                  </Label>
                  <Input 
                    id="poste" 
                    name='poste'
                    type="text" 
                    className="w-full bg-gray-100 border-0 focus:bg-white focus:ring-2 focus:ring-pink-500" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-sm font-medium text-gray-700">
                    Expérience
                  </Label>
                  <Input 
                    id="experience" 
                    name='experience'
                    type="number" 
                    className="w-full bg-gray-100 border-0 focus:bg-white focus:ring-2 focus:ring-pink-500" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tjm" className="text-sm font-medium text-gray-700">
                    TJM
                  </Label>
                  <Input 
                    id="tjm"
                    name='tjm'
                    type="number" 
                    className="w-full bg-gray-100 border-0 focus:bg-white focus:ring-2 focus:ring-pink-500" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="id-stripe" className="text-sm font-medium text-gray-700">
                    Id stripe
                  </Label>
                  <Input 
                    id="stripeId" 
                    name='stripeId'
                    type="text" 
                    className="w-full bg-gray-100 border-0 focus:bg-white focus:ring-2 focus:ring-pink-500" 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <Button
            type="submit"
            className="w-full max-w-2xl text-white font-bold p-6"
            style={{ backgroundColor: '#FF4D6D' }}
          >
            Enregistrer les modifications
          </Button>
        </div>
      </div> 
    </form>
  );
};

export default FreelanceProfile;