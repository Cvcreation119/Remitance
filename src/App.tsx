/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Globe, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  User, 
  DollarSign,
  Info,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

interface TransferDetails {
  trackingNumber: string;
  status: 'available' | 'pending' | 'completed';
  amountUSD: string;
  amountPHP: string;
  senderName: string;
  receiverName: string;
  pickupLocation: string;
  sendDate: string;
  expiryDate: string;
}

export default function App() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [amountUSD, setAmountUSD] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<TransferDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const USD_TO_PHP_RATE = 56.25;

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim() || trackingNumber.length < 10) {
      setError('Please enter a valid 10-digit tracking number');
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      setError('Please enter both first and last name');
      return;
    }
    if (!amountUSD || isNaN(Number(amountUSD)) || Number(amountUSD) <= 0) {
      setError('Please enter a valid amount in USD');
      return;
    }

    setError(null);
    setIsSearching(true);
    setResult(null);

    // Simulate network delay
    setTimeout(() => {
      setIsSearching(false);
      const usdValue = Number(amountUSD);
      const phpValue = usdValue * USD_TO_PHP_RATE;

      setResult({
        trackingNumber: trackingNumber.toUpperCase(),
        status: 'available',
        amountUSD: usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        amountPHP: phpValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        senderName: 'Jacob Beirstine',
        receiverName: `${firstName} ${lastName}`,
        pickupLocation: 'Any Cebuana Lhuillier Branch',
        sendDate: new Date().toLocaleDateString(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
              <Globe className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">WorId Remit</span>
          </div>
          
          <div className="hidden md:flex md:items-center md:gap-8">
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Send Money</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Locations</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Help</a>
            <Button variant="outline" size="sm">Log In</Button>
            <Button size="sm">Sign Up</Button>
          </div>

          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t bg-white px-4 py-4 space-y-4"
            >
              <a href="#" className="block text-base font-medium text-slate-600">Send Money</a>
              <a href="#" className="block text-base font-medium text-slate-600">Locations</a>
              <a href="#" className="block text-base font-medium text-slate-600">Help</a>
              <div className="flex flex-col gap-2 pt-2">
                <Button variant="outline" className="w-full">Log In</Button>
                <Button className="w-full">Sign Up</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          
          {/* Left Column: Hero & Search */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                Global Money Tracking
              </Badge>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Track your transfer <span className="text-primary">anywhere</span> in the world.
              </h1>
              <p className="max-w-xl text-lg text-slate-600">
                Enter your tracking number (MTCN) below to see the real-time status of your money transfer.
              </p>
            </div>

            <Card className="border-none shadow-2xl shadow-slate-200/50">
              <CardHeader>
                <CardTitle className="text-xl">Track Transfer</CardTitle>
                <CardDescription>Enter the 10-digit tracking number provided on your receipt.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input 
                        id="first-name"
                        placeholder="Receiver's First Name" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input 
                        id="last-name"
                        placeholder="Receiver's Last Name" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount-usd">Amount (USD)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <Input 
                        id="amount-usd"
                        type="number"
                        step="0.01"
                        placeholder="0.00" 
                        className="pl-10"
                        value={amountUSD}
                        onChange={(e) => setAmountUSD(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tracking-number">Tracking Number (MTCN)</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <Input 
                        id="tracking-number"
                        placeholder="10-digit MTCN" 
                        maxLength={10}
                        className="pl-10 h-12 text-lg"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                    {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <span className="flex items-center gap-2">
                        <Clock className="h-5 w-5 animate-spin" />
                        Searching...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Track Transfer
                        <ArrowRight className="h-5 w-5" />
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="bg-slate-50/50 px-6 py-4 rounded-b-xl border-t">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Your data is encrypted and secure.
                </div>
              </CardFooter>
            </Card>

            {/* Features Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {[
                { icon: Clock, title: "Real-time Updates", desc: "Get instant status changes on your transfer." },
                { icon: MapPin, title: "Global Network", desc: "Over 500,000 agent locations worldwide." },
                { icon: ShieldCheck, title: "Secure & Trusted", desc: "Industry-leading security for your peace of mind." },
                { icon: Globe, title: "190+ Countries", desc: "Send and receive money across borders easily." },
              ].map((feature, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-primary">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                    <p className="text-sm text-slate-500">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:sticky lg:top-32">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Card className="overflow-hidden border-none shadow-2xl shadow-slate-200/50">
                    <div className="bg-emerald-500 px-6 py-8 text-white text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                        <CheckCircle2 className="h-10 w-10" />
                      </div>
                      <h2 className="text-2xl font-bold">Ready for Pickup</h2>
                      <p className="mt-1 text-emerald-50 opacity-90">The funds are available at any agent location.</p>
                    </div>
                    
                    <CardContent className="p-0">
                      <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Amount to Receive (PHP)</p>
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-bold text-emerald-600">₱{result.amountPHP}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 italic">Converted from ${result.amountUSD} USD</p>
                          </div>
                          <div className="flex flex-col items-end justify-center">
                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3 py-1 mb-1">
                              Available
                            </Badge>
                            <p className="text-[10px] text-slate-400">Rate: 1 USD = 56.25 PHP</p>
                          </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-slate-400">
                              <User className="h-3.5 w-3.5" />
                              <span className="text-xs font-medium uppercase tracking-wider">Sender</span>
                            </div>
                            <p className="font-semibold text-slate-900">{result.senderName}</p>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-slate-400">
                              <User className="h-3.5 w-3.5" />
                              <span className="text-xs font-medium uppercase tracking-wider">Receiver</span>
                            </div>
                            <p className="font-semibold text-slate-900">{result.receiverName}</p>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-slate-400">
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="text-xs font-medium uppercase tracking-wider">Pickup Location</span>
                          </div>
                          <p className="font-semibold text-slate-900">{result.pickupLocation}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Send Date</span>
                            <p className="font-medium text-slate-700">{result.sendDate}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Expiry Date</span>
                            <p className="font-medium text-slate-700">{result.expiryDate}</p>
                          </div>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4 flex items-start gap-3">
                          <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <div className="text-sm text-slate-600">
                            <p className="font-semibold text-slate-900 mb-1">How to pick up your money:</p>
                            <ul className="list-disc list-inside space-y-1">
                              <li>Bring a valid government-issued ID.</li>
                              <li>Provide the tracking number: <span className="font-mono font-bold text-primary">{result.trackingNumber}</span></li>
                              <li>Complete the receiver form at the location.</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-slate-50 px-6 py-4 flex justify-between items-center">
                      <Button variant="ghost" size="sm" className="text-slate-500" onClick={() => setResult(null)}>
                        Track Another
                      </Button>
                      <Button size="sm" className="gap-2">
                        Print Receipt
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hidden lg:flex flex-col items-center justify-center h-[500px] rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-12 text-center"
                >
                  <div className="mb-6 rounded-full bg-white p-6 shadow-sm">
                    <Search className="h-12 w-12 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">No Transfer Selected</h3>
                  <p className="mt-2 text-slate-500">
                    Enter a tracking number on the left to view the details and status of your money transfer.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2 opacity-50 grayscale">
              <Globe className="h-5 w-5" />
              <span className="text-lg font-bold tracking-tight">WorId Remit</span>
            </div>
            <p className="text-sm text-slate-500">
              © 2026 WorId Remit Global Financial Services. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-slate-400 hover:text-slate-600">Privacy Policy</a>
              <a href="#" className="text-sm text-slate-400 hover:text-slate-600">Terms of Service</a>
              <a href="#" className="text-sm text-slate-400 hover:text-slate-600">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
