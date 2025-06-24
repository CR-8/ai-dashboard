"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Avatar } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  User, 
  Mail, 
  Lock, 
  Save, 
  AlertCircle, 
  CheckCircle,
  TrendingUp,
  Eye,
  Bookmark,
  Activity,
  DollarSign,
  Target,
  Bell,
  Settings,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  Award,
  Globe,
  Shield,
  ArrowUpRight,
  Plus,
  RefreshCw,
  Download,
  Upload,
  Edit,
  Trash2,
  MoreHorizontal,
  Building,
  MapPin,
  Link,
  Github,
  Linkedin,
  Twitter
} from 'lucide-react';

function ProfilePage() {
    const { user, updateProfile, changePassword, loading } = useAuth();
    
    // Profile data state
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        bio: '',
        location: '',
        website: '',
        linkedin: '',
        twitter: ''
    });
    
    // Password data state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    // Watchlist and portfolio data
    const [watchlist, setWatchlist] = useState([]);
    const [portfolioData, setPortfolioData] = useState({
        totalValue: 125420.50,
        totalGain: 8420.50,
        totalGainPercent: 7.2,
        todayGain: 1250.30,
        todayGainPercent: 1.8
    });
    
    // Activity and statistics
    const [activityStats, setActivityStats] = useState({
        totalSearches: 1247,
        companiesAnalyzed: 89,
        reportsGenerated: 23,
        lastLogin: new Date().toISOString()
    });
    
    // Recent activity
    const [recentActivity, setRecentActivity] = useState([
        { id: 1, type: 'search', description: 'Searched for Apple Inc. (AAPL)', timestamp: '2 hours ago', icon: Eye },
        { id: 2, type: 'watchlist', description: 'Added Microsoft to watchlist', timestamp: '5 hours ago', icon: Bookmark },
        { id: 3, type: 'analysis', description: 'Generated report for Tesla Inc.', timestamp: '1 day ago', icon: BarChart3 },
        { id: 4, type: 'portfolio', description: 'Updated portfolio allocation', timestamp: '2 days ago', icon: PieChart }
    ]);
    
    // Notification settings
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        pushNotifications: false,
        priceAlerts: true,
        portfolioUpdates: true,
        marketNews: false,
        weeklyReports: true
    });
    
    // UI state
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('overview');    useEffect(() => {
        if (user) {
            setProfileData({
                firstName: user.user_metadata?.first_name || '',
                lastName: user.user_metadata?.last_name || '',
                email: user.email || '',
                phone: user.user_metadata?.phone || '',
                company: user.user_metadata?.company || '',
                bio: user.user_metadata?.bio || '',
                location: user.user_metadata?.location || '',
                website: user.user_metadata?.website || '',
                linkedin: user.user_metadata?.linkedin || '',
                twitter: user.user_metadata?.twitter || ''
            });
        }
        
        // Load watchlist from localStorage
        const savedWatchlist = JSON.parse(localStorage.getItem('stockWatchlist') || '[]');
        setWatchlist(savedWatchlist);
    }, [user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        setMessage('');
        setError('');

        try {            const result = await updateProfile({
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                phone: profileData.phone,
                company: profileData.company,
                bio: profileData.bio,
                location: profileData.location,
                website: profileData.website,
                linkedin: profileData.linkedin,
                twitter: profileData.twitter
            });

            if (result.success) {
                setMessage('Profile updated successfully!');
            } else {
                setError(result.error || 'Failed to update profile');
            }
        } catch (error) {
            setError('An error occurred while updating profile');
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordLoading(true);
        setMessage('');
        setError('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match');
            setPasswordLoading(false);
            return;
        }

        if (passwordData.newPassword.length < 8) {
            setError('New password must be at least 8 characters long');
            setPasswordLoading(false);
            return;
        }

        try {
            const result = await changePassword(passwordData.newPassword);

            if (result.success) {
                setMessage('Password changed successfully!');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                setError(result.error || 'Failed to change password');
            }
        } catch (error) {
            setError('An error occurred while changing password');
        } finally {
            setPasswordLoading(false);
        }
    };    // Utility functions
    const handleNotificationToggle = (setting) => {
        setNotificationSettings(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }));
    };

    const removeFromWatchlist = (symbol) => {
        const updatedWatchlist = watchlist.filter(item => item !== symbol);
        setWatchlist(updatedWatchlist);
        localStorage.setItem('stockWatchlist', JSON.stringify(updatedWatchlist));
    };

    const getActivityIcon = (type) => {
        const icons = {
            search: Eye,
            watchlist: Bookmark,
            analysis: BarChart3,
            portfolio: PieChart
        };
        return icons[type] || Activity;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white font-mono flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Loading...
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white font-mono">Access Denied</div>
            </div>
        );
    }

    return (
        <TooltipProvider>
            <div className="min-h-screen bg-black text-white">
                {/* Header */}
                <div className="border-b border-zinc-800 bg-black sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-mono font-bold tracking-tight">Portfolio</h1>
                                <p className="text-zinc-500 text-sm font-mono mt-1">Professional Dashboard</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant="outline" className="border-white text-white font-mono">
                                    PRO
                                </Badge>
                                <div className="h-8 w-8 bg-white text-black flex items-center justify-center text-sm font-mono font-bold">
                                    {profileData.firstName?.[0]?.toUpperCase() || 'U'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                {message && (
                    <div className="max-w-7xl mx-auto px-8 pt-6">
                        <Alert className="border-white bg-black">
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription className="text-white font-mono">
                                {message}
                            </AlertDescription>
                        </Alert>
                    </div>
                )}

                {error && (
                    <div className="max-w-7xl mx-auto px-8 pt-6">
                        <Alert className="border-white bg-black">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-white font-mono">
                                {error}
                            </AlertDescription>
                        </Alert>
                    </div>
                )}

                <div className="max-w-7xl mx-auto px-8 py-8">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                        <TabsList className="bg-black border border-zinc-800">
                            <TabsTrigger value="overview" className="font-mono data-[state=active]:bg-white data-[state=active]:text-black">
                                Overview
                            </TabsTrigger>
                            <TabsTrigger value="portfolio" className="font-mono data-[state=active]:bg-white data-[state=active]:text-black">
                                Portfolio
                            </TabsTrigger>
                            <TabsTrigger value="activity" className="font-mono data-[state=active]:bg-white data-[state=active]:text-black">
                                Activity
                            </TabsTrigger>
                            <TabsTrigger value="settings" className="font-mono data-[state=active]:bg-white data-[state=active]:text-black">
                                Settings
                            </TabsTrigger>
                        </TabsList>                        
                        {/* Overview Tab */}
                        <TabsContent value="overview" className="space-y-8">
                            {/* Bento Grid Layout */}
                            <div className="grid grid-cols-12 gap-6">
                                {/* Profile Card - Spans 4 columns */}
                                <Card className="col-span-12 lg:col-span-4 text-zinc-200 border-zinc-800 bg-zinc-950">
                                    <CardContent className="p-6">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-16 w-16 bg-white text-black flex items-center justify-center text-xl font-mono font-bold">
                                                    {profileData.firstName?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <h3 className="font-mono font-semibold text-lg">
                                                        {profileData.firstName} {profileData.lastName}
                                                    </h3>
                                                    <p className="text-zinc-400 font-mono text-sm">{profileData.email}</p>
                                                    <p className="text-zinc-500 font-mono text-xs">{profileData.company}</p>
                                                </div>
                                            </div>
                                            
                                            {profileData.bio && (
                                                <div>
                                                    <p className="text-zinc-300 font-mono text-sm leading-relaxed">
                                                        {profileData.bio}
                                                    </p>
                                                </div>
                                            )}
                                            
                                            <div className="space-y-3 text-sm font-mono">
                                                {profileData.location && (
                                                    <div className="flex items-center gap-2 text-zinc-400">
                                                        <MapPin className="h-3 w-3" />
                                                        <span>{profileData.location}</span>
                                                    </div>
                                                )}
                                                {profileData.website && (
                                                    <div className="flex items-center gap-2 text-zinc-400">
                                                        <Link className="h-3 w-3" />
                                                        <span>{profileData.website}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 text-zinc-400">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Stats Grid - Spans 8 columns */}
                                <div className="col-span-12 lg:col-span-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <Card className="border-zinc-800 text-zinc-400 bg-zinc-950">
                                        <CardContent className="p-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <Eye className="h-4 w-4 text-zinc-400" />
                                                    <Badge variant="outline" className="border-zinc-700 text-zinc-400 font-mono text-xs">
                                                        TODAY
                                                    </Badge>
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-mono font-bold">{activityStats.totalSearches}</p>
                                                    <p className="text-zinc-500 text-xs font-mono">SEARCHES</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    
                                    <Card className="border-zinc-800 text-zinc-400 bg-zinc-950">
                                        <CardContent className="p-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <BarChart3 className="h-4 w-4 text-zinc-400" />
                                                    <Badge variant="outline" className="border-zinc-700 text-zinc-400 font-mono text-xs">
                                                        TOTAL
                                                    </Badge>
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-mono font-bold">{activityStats.companiesAnalyzed}</p>
                                                    <p className="text-zinc-500 text-xs font-mono">ANALYZED</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    
                                    <Card className="border-zinc-800text-zinc-400 bg-zinc-950">
                                        <CardContent className="p-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <Bookmark className="h-4 w-4 text-zinc-400" />
                                                    <Badge variant="outline" className="border-zinc-700 text-zinc-400 font-mono text-xs">
                                                        ACTIVE
                                                    </Badge>
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-mono font-bold">{watchlist.length}</p>
                                                    <p className="text-zinc-500 text-xs font-mono">WATCHLIST</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    
                                    <Card className="border-zinc-800 text-zinc-400 bg-zinc-950">
                                        <CardContent className="p-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <Award className="h-4 w-4 text-zinc-400" />
                                                    <Badge variant="outline" className="border-zinc-700 text-zinc-400 font-mono text-xs">
                                                        GENERATED
                                                    </Badge>
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-mono font-bold">{activityStats.reportsGenerated}</p>
                                                    <p className="text-zinc-500 text-xs font-mono">REPORTS</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Activity Feed - Full width */}
                                <Card className="col-span-12 border-zinc-800 text-zinc-300 bg-zinc-950">
                                    <CardHeader>
                                        <CardTitle className="font-mono flex items-center gap-2">
                                            <Activity className="h-4 w-4" />
                                            Recent Activity
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-1">
                                            {recentActivity.map((activity) => (
                                                <div key={activity.id} className="flex items-center gap-4 p-3 border border-zinc-800 hover:bg-zinc-900 transition-colors">
                                                    <activity.icon className="h-4 w-4 text-zinc-400" />
                                                    <div className="flex-1">
                                                        <p className="font-mono text-sm">{activity.description}</p>
                                                    </div>
                                                    <div className="text-zinc-500 font-mono text-xs">
                                                        {activity.timestamp}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>                        
                        {/* Portfolio Tab */}
                        <TabsContent value="portfolio" className="space-y-8">
                            <div className="grid grid-cols-12 gap-6">
                                {/* Portfolio Value Cards */}
                                <Card className="col-span-12 md:col-span-6 lg:col-span-3 text-zinc-300 border-zinc-800 bg-zinc-950">
                                    <CardContent className="p-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <DollarSign className="h-5 w-5 text-zinc-400" />
                                                <Badge variant="outline" className="border-zinc-700 text-zinc-400 font-mono text-xs">
                                                    TOTAL
                                                </Badge>
                                            </div>
                                            <div>
                                                <p className="text-3xl font-mono font-bold">{formatCurrency(portfolioData.totalValue)}</p>
                                                <p className="text-zinc-500 text-sm font-mono">PORTFOLIO VALUE</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="col-span-12 md:col-span-6 lg:col-span-3 text-zinc-300 border-zinc-800 bg-zinc-950">
                                    <CardContent className="p-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <TrendingUp className="h-5 w-5 text-zinc-400" />
                                                <Badge variant="outline" className="border-zinc-700 text-zinc-400 font-mono text-xs">
                                                    GAIN
                                                </Badge>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-mono font-bold">+{formatCurrency(portfolioData.totalGain)}</p>
                                                <p className="text-zinc-500 text-sm font-mono">+{portfolioData.totalGainPercent}% TOTAL</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="col-span-12 md:col-span-6 lg:col-span-3 text-zinc-300 border-zinc-800 bg-zinc-950">
                                    <CardContent className="p-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Clock className="h-5 w-5 text-zinc-400" />
                                                <Badge variant="outline" className="border-zinc-700 text-zinc-400 font-mono text-xs">
                                                    TODAY
                                                </Badge>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-mono font-bold">+{formatCurrency(portfolioData.todayGain)}</p>
                                                <p className="text-zinc-500 text-sm font-mono">+{portfolioData.todayGainPercent}% 1D</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="col-span-12 md:col-span-6 lg:col-span-3 text-zinc-300 border-zinc-800 bg-zinc-950">
                                    <CardContent className="p-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Target className="h-5 w-5 text-zinc-400" />
                                                <Badge variant="outline" className="border-zinc-700 text-zinc-400 font-mono text-xs">
                                                    PERF
                                                </Badge>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-mono font-bold">{portfolioData.totalGainPercent}%</p>
                                                <p className="text-zinc-500 text-sm font-mono">YTD RETURN</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Watchlist */}
                                <Card className="col-span-12 lg:col-span-8 text-zinc-300 border-zinc-800 bg-zinc-950">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="font-mono flex items-center gap-2">
                                                <Bookmark className="h-4 w-4" />
                                                Watchlist ({watchlist.length})
                                            </CardTitle>
                                            <Button size="sm" variant="outline" className="border-zinc-700 font-mono">
                                                <Plus className="h-3 w-3 mr-2" />
                                                ADD
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {watchlist.length === 0 ? (
                                            <div className="text-center py-12">
                                                <Bookmark className="h-8 w-8 text-zinc-600 mx-auto mb-4" />
                                                <p className="text-zinc-400 font-mono">No positions tracked</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                {watchlist.map((symbol, index) => (
                                                    <div key={symbol} className="flex items-center justify-between p-4 border border-zinc-800 hover:bg-zinc-900 transition-colors">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-8 h-8 bg-white text-black flex items-center justify-center text-xs font-mono font-bold">
                                                                {symbol.slice(0, 2)}
                                                            </div>
                                                            <div>
                                                                <p className="font-mono font-semibold">{symbol}</p>
                                                                <p className="text-zinc-500 font-mono text-xs">EQUITY</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className="text-right font-mono text-sm">
                                                                <p>$150.25</p>
                                                                <p className="text-zinc-400">+2.5%</p>
                                                            </div>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => removeFromWatchlist(symbol)}
                                                                className="text-zinc-400 hover:text-white"
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Quick Actions */}
                                <Card className="col-span-12 lg:col-span-4 text-zinc-300 border-zinc-800 bg-zinc-950">
                                    <CardHeader>
                                        <CardTitle className="font-mono">Actions</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <Button className="w-full justify-start font-mono" variant="outline">
                                            <Download className="h-3 w-3 mr-2" />
                                            Export Data
                                        </Button>
                                        <Button className="w-full justify-start font-mono" variant="outline">
                                            <Upload className="h-3 w-3 mr-2" />
                                            Import Portfolio
                                        </Button>
                                        <Button className="w-full justify-start font-mono" variant="outline">
                                            <RefreshCw className="h-3 w-3 mr-2" />
                                            Sync Prices
                                        </Button>
                                        <Button className="w-full justify-start font-mono" variant="outline">
                                            <BarChart3 className="h-3 w-3 mr-2" />
                                            Generate Report
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>                        
                        {/* Activity Tab */}
                        <TabsContent value="activity" className="space-y-8">
                            <div className="grid grid-cols-12 gap-6">
                                {/* Activity Overview */}
                                <Card className="col-span-12 lg:col-span-8 text-zinc-300 border-zinc-800 bg-zinc-950">
                                    <CardHeader>
                                        <CardTitle className="font-mono flex items-center gap-2">
                                            <Activity className="h-4 w-4" />
                                            Activity Log
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-1">
                                            {recentActivity.map((activity) => (
                                                <div key={activity.id} className="flex items-center gap-4 p-4 border border-zinc-800 hover:bg-zinc-900 transition-colors">
                                                    <activity.icon className="h-4 w-4 text-zinc-400" />
                                                    <div className="flex-1">
                                                        <p className="font-mono text-sm">{activity.description}</p>
                                                    </div>
                                                    <div className="text-zinc-500 font-mono text-xs">
                                                        {activity.timestamp}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Activity Stats */}
                                <div className="col-span-12 lg:col-span-4 space-y-6">
                                    <Card className="border-zinc-800 text-zinc-300 bg-zinc-950">
                                        <CardHeader>
                                            <CardTitle className="font-mono text-lg">Statistics</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="p-4 border border-zinc-800">
                                                <p className="text-2xl font-mono font-bold">{activityStats.totalSearches}</p>
                                                <p className="text-zinc-500 font-mono text-xs">TOTAL SEARCHES</p>
                                            </div>
                                            <div className="p-4 border border-zinc-800">
                                                <p className="text-2xl font-mono font-bold">{activityStats.companiesAnalyzed}</p>
                                                <p className="text-zinc-500 font-mono text-xs">COMPANIES ANALYZED</p>
                                            </div>
                                            <div className="p-4 border border-zinc-800">
                                                <p className="text-2xl font-mono font-bold">{activityStats.reportsGenerated}</p>
                                                <p className="text-zinc-500 font-mono text-xs">REPORTS GENERATED</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>                        
                        {/* Settings Tab */}
                        <TabsContent value="settings" className="space-y-8">
                            <div className="grid grid-cols-12 gap-6">
                                {/* Profile Settings */}
                                <Card className="col-span-12 lg:col-span-6 text-zinc-300 border-zinc-800 bg-zinc-950">
                                    <CardHeader>
                                        <CardTitle className="font-mono flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Profile Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-mono font-medium mb-2">FIRST NAME</label>
                                                    <Input
                                                        value={profileData.firstName}
                                                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                                                        className="border-zinc-700 bg-zinc-900 font-mono"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-mono font-medium mb-2">LAST NAME</label>
                                                    <Input
                                                        value={profileData.lastName}
                                                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                                                        className="border-zinc-700 bg-zinc-900 font-mono"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-mono font-medium mb-2">EMAIL</label>
                                                <Input
                                                    value={profileData.email}
                                                    className="border-zinc-700 bg-zinc-900 font-mono"
                                                    disabled
                                                    type="email"
                                                />
                                                <p className="text-xs text-zinc-500 font-mono mt-1">READ ONLY</p>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-mono font-medium mb-2">PHONE</label>
                                                    <Input
                                                        value={profileData.phone}
                                                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                                        className="border-zinc-700 bg-zinc-900 font-mono"
                                                        type="tel"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-mono font-medium mb-2">COMPANY</label>
                                                    <Input
                                                        value={profileData.company}
                                                        onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                                                        className="border-zinc-700 bg-zinc-900 font-mono"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-mono font-medium mb-2">BIO</label>
                                                <Input
                                                    value={profileData.bio}
                                                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                                                    className="border-zinc-700 bg-zinc-900 font-mono"
                                                    placeholder="Professional summary..."
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-mono font-medium mb-2">LOCATION</label>
                                                <Input
                                                    value={profileData.location}
                                                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                                                    className="border-zinc-700 bg-zinc-900 font-mono"
                                                    placeholder="City, Country"
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={profileLoading}
                                                className="w-full bg-white text-black hover:bg-zinc-200 font-mono"
                                            >
                                                {profileLoading ? (
                                                    <>
                                                        <Save className="mr-2 h-4 w-4 animate-spin" />
                                                        UPDATING...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="mr-2 h-4 w-4" />
                                                        UPDATE PROFILE
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>

                                {/* Security Settings */}
                                <Card className="col-span-12 lg:col-span-6 text-zinc-300 border-zinc-800 bg-zinc-950">
                                    <CardHeader>
                                        <CardTitle className="font-mono flex items-center gap-2">
                                            <Lock className="h-4 w-4" />
                                            Security Settings
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handlePasswordChange} className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-mono font-medium mb-2">CURRENT PASSWORD</label>
                                                <Input
                                                    type="password"
                                                    value={passwordData.currentPassword}
                                                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                                    className="border-zinc-700 bg-zinc-900 font-mono"
                                                    required
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-mono font-medium mb-2">NEW PASSWORD</label>
                                                <Input
                                                    type="password"
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                                    className="border-zinc-700 bg-zinc-900 font-mono"
                                                    required
                                                    minLength={8}
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-mono font-medium mb-2">CONFIRM PASSWORD</label>
                                                <Input
                                                    type="password"
                                                    value={passwordData.confirmPassword}
                                                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                                    className="border-zinc-700 bg-zinc-900 font-mono"
                                                    required
                                                    minLength={8}
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={passwordLoading}
                                                className="w-full bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700 font-mono"
                                            >
                                                {passwordLoading ? (
                                                    <>
                                                        <Lock className="mr-2 h-4 w-4 animate-spin" />
                                                        CHANGING...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Lock className="mr-2 h-4 w-4" />
                                                        CHANGE PASSWORD
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>

                                {/* Notification Settings */}
                                <Card className="col-span-12 lg:col-span-6 text-zinc-300 border-zinc-800 bg-zinc-950">
                                    <CardHeader>
                                        <CardTitle className="font-mono flex items-center gap-2">
                                            <Bell className="h-4 w-4" />
                                            Notifications
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {Object.entries(notificationSettings).map(([key, value]) => (
                                            <div key={key} className="flex items-center justify-between p-3 border border-zinc-800">
                                                <div>
                                                    <p className="font-mono font-medium text-sm">
                                                        {key.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}
                                                    </p>
                                                    <p className="text-xs text-zinc-500 font-mono">
                                                        {key === 'emailNotifications' && 'Email notifications'}
                                                        {key === 'pushNotifications' && 'Browser notifications'}
                                                        {key === 'priceAlerts' && 'Price change alerts'}
                                                        {key === 'portfolioUpdates' && 'Portfolio updates'}
                                                        {key === 'marketNews' && 'Market news'}
                                                        {key === 'weeklyReports' && 'Weekly reports'}
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={value}
                                                    onCheckedChange={() => handleNotificationToggle(key)}
                                                />
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>

                                {/* Account Information */}
                                <Card className="col-span-12 lg:col-span-6 text-zinc-300 border-zinc-800 bg-zinc-950">
                                    <CardHeader>
                                        <CardTitle className="font-mono flex items-center gap-2">
                                            <Shield className="h-4 w-4" />
                                            Account Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center p-3 border border-zinc-800">
                                                <span className="text-zinc-400 font-mono text-sm">USER ID</span>
                                                <span className="font-mono text-xs">{user.id.slice(0, 8)}...</span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 border border-zinc-800">
                                                <span className="text-zinc-400 font-mono text-sm">EMAIL STATUS</span>
                                                <Badge variant={user.email_confirmed_at ? "default" : "destructive"} className="font-mono">
                                                    {user.email_confirmed_at ? 'VERIFIED' : 'UNVERIFIED'}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between items-center p-3 border border-zinc-800">
                                                <span className="text-zinc-400 font-mono text-sm">CREATED</span>
                                                <span className="font-mono text-sm">{new Date(user.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 border border-zinc-800">
                                                <span className="text-zinc-400 font-mono text-sm">LAST SIGN IN</span>
                                                <span className="font-mono text-sm">{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 border border-zinc-800">
                                                <span className="text-zinc-400 font-mono text-sm">ACCOUNT TYPE</span>
                                                <Badge className="bg-white text-black font-mono">
                                                    PRO MEMBER
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>                        
                        </TabsContent>
                    </Tabs>
                </div>
            </div>      
        </TooltipProvider>
    );
}

export default ProfilePage;
