


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { baseUrl } from '../lib/base-url';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Wallet, 
  TrendingDown, 
  TrendingUp,
  Eye,
  EyeOff,
  Download,
  History,
  AlertCircle,
  Settings,
  RefreshCw,
  Edit
} from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  requestedBy: 'admin' | 'approver';
  approvedBy?: string;
  approvedDate?: string;
  rejectedBy?: string;
  rejectedDate?: string;
}

interface Settings {
  startingBalance: number;
  adminPin: string;
  approverPin: string;
  adminName: string;
  approverName: string;
}

const AuntCashTracker = () => {
  // State
  const [currentUser, setCurrentUser] = useState<'admin' | 'approver' | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [showBalance, setShowBalance] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [settings, setSettings] = useState<Settings>({
    startingBalance: 250000,
    adminPin: '1234',
    approverPin: '5678',
    adminName: 'Admin',
    approverName: 'Tita'
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentBalance, setCurrentBalance] = useState(settings.startingBalance);

  // Form state
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Settings dialog state
  const [showSettings, setShowSettings] = useState(false);
  const [newBalance, setNewBalance] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Edit transaction state
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // Alert state
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Restore logged-in user from localStorage
        const savedUser = localStorage.getItem('aunt-tracker-user');
        if (savedUser === 'admin' || savedUser === 'approver') {
          setCurrentUser(savedUser);
        }
        
        const response = await fetch(`${baseUrl}/api/aunt-tracker`);
        if (response.ok) {
          const data = await response.json();
          setSettings(data.settings);
          setTransactions(data.transactions);
          
          // Recalculate balance
          const approvedTransactions = data.transactions.filter((t: Transaction) => t.status === 'approved');
          const totalDeductions = approvedTransactions.reduce((sum: number, t: Transaction) => sum + t.amount, 0);
          setCurrentBalance(data.settings.startingBalance - totalDeductions);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        showAlert('error', 'Failed to load data from server');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save to server function (call manually after changes)
  const saveToServer = async (updatedSettings: Settings, updatedTransactions: Transaction[]) => {
    try {
      setIsSaving(true);
      const response = await fetch(`${baseUrl}/api/aunt-tracker`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          settings: updatedSettings, 
          transactions: updatedTransactions 
        })
      });

      if (!response.ok) {
        console.error('Failed to save data to server');
        showAlert('error', 'Failed to save to server');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      showAlert('error', 'Failed to save to server');
    } finally {
      setIsSaving(false);
    }
  };

  // Show alert temporarily
  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  // Handle PIN login
  const handleLogin = () => {
    // Check which PIN matches
    if (pinInput === settings.adminPin) {
      setCurrentUser('admin');
      localStorage.setItem('aunt-tracker-user', 'admin');
      setPinInput('');
      showAlert('success', `Welcome, ${settings.adminName}! 👋`);
    } else if (pinInput === settings.approverPin) {
      setCurrentUser('approver');
      localStorage.setItem('aunt-tracker-user', 'approver');
      setPinInput('');
      showAlert('success', `Welcome, ${settings.approverName}! 👋`);
    } else {
      showAlert('error', 'Incorrect PIN');
      setPinInput('');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('aunt-tracker-user'); // Clear persisted login
    showAlert('success', 'Logged out successfully');
  };

  // Update starting balance
  const handleUpdateBalance = async () => {
    const balance = parseFloat(newBalance);
    if (isNaN(balance) || balance < 0) {
      showAlert('error', 'Please enter a valid balance');
      return;
    }

    // Recalculate current balance based on approved transactions
    const approvedTransactions = transactions.filter(t => t.status === 'approved');
    const totalDeductions = approvedTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    const updatedSettings = { ...settings, startingBalance: balance };
    setSettings(updatedSettings);
    setCurrentBalance(balance - totalDeductions);
    
    // Save to server
    await saveToServer(updatedSettings, transactions);
    
    setNewBalance('');
    setShowSettings(false);
    showAlert('success', `Starting balance updated to ₱${balance.toLocaleString()}`);
  };

  // Reset everything
  const handleReset = async () => {
    if (window.confirm('⚠️ Are you absolutely sure? This will delete ALL transactions and reset the balance. This cannot be undone!')) {
      try {
        const balance = parseFloat(newBalance) || settings.startingBalance;
        
        // If user provided a new balance, update settings first
        if (newBalance) {
          const newSettings = { ...settings, startingBalance: balance };
          await fetch(`${baseUrl}/api/aunt-tracker`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ settings: newSettings, transactions: [] })
          });
          
          setSettings(newSettings);
          setCurrentBalance(balance);
        } else {
          // Just clear transactions
          await fetch(`${baseUrl}/api/aunt-tracker`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ settings, transactions: [] })
          });
          
          setCurrentBalance(settings.startingBalance);
        }
        
        setTransactions([]);
        setNewBalance('');
        setShowResetConfirm(false);
        setShowSettings(false);
        showAlert('success', 'System reset complete! Starting fresh.');
      } catch (error) {
        console.error('Error resetting data:', error);
        showAlert('error', 'Failed to reset data. Please try again.');
      }
    }
  };

  // Add transaction
  const handleAddTransaction = async () => {
    if (!amount || !description) {
      showAlert('error', 'Please fill in amount and description');
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      description: description.trim(),
      amount: parseFloat(amount),
      status: 'pending',
      notes: notes.trim(),
      requestedBy: currentUser || 'admin'
    };

    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    
    // Save to server
    await saveToServer(settings, updatedTransactions);
    
    setAmount('');
    setDescription('');
    setNotes('');
    setShowForm(false);
    showAlert('success', 'Request submitted for approval! ✅');
  };

  // Edit transaction (only if pending and requested by someone else)
  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setEditAmount(transaction.amount.toString());
    setEditDescription(transaction.description);
    setEditNotes(transaction.notes || '');
  };

  // Save edited transaction
  const handleSaveEdit = async () => {
    if (!editingTransaction || !editAmount || !editDescription) {
      showAlert('error', 'Please fill in amount and description');
      return;
    }

    const updatedTransactions = transactions.map(t => 
      t.id === editingTransaction.id 
        ? { 
            ...t,
            amount: parseFloat(editAmount),
            description: editDescription.trim(),
            notes: editNotes.trim()
          } 
        : t
    );

    setTransactions(updatedTransactions);
    
    // Save to server
    await saveToServer(settings, updatedTransactions);
    
    setEditingTransaction(null);
    setEditAmount('');
    setEditDescription('');
    setEditNotes('');
    showAlert('success', 'Transaction updated! ✏️');
  };

  // Approve transaction
  const handleApprove = async (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;

    const approverName = currentUser === 'admin' ? settings.adminName : settings.approverName;

    const updatedTransactions = transactions.map(t => 
      t.id === id 
        ? { 
            ...t, 
            status: 'approved' as const,
            approvedBy: approverName,
            approvedDate: new Date().toISOString()
          } 
        : t
    );

    setTransactions(updatedTransactions);
    setCurrentBalance(prev => prev - transaction.amount);
    
    // Save to server
    await saveToServer(settings, updatedTransactions);
    
    showAlert('success', `Approved! Deducted ₱${transaction.amount.toLocaleString()}`);
  };

  // Reject transaction
  const handleReject = async (id: string) => {
    const rejecterName = currentUser === 'admin' ? settings.adminName : settings.approverName;
    
    const updatedTransactions = transactions.map(t => 
      t.id === id 
        ? { 
            ...t, 
            status: 'rejected' as const,
            rejectedBy: rejecterName,
            rejectedDate: new Date().toISOString()
          } 
        : t
    );

    setTransactions(updatedTransactions);
    
    // Save to server
    await saveToServer(settings, updatedTransactions);
    
    showAlert('success', 'Transaction rejected');
  };

  // Export to text
  const handleExport = () => {
    let exportText = `CASH TRACKER SUMMARY\n`;
    exportText += `Generated: ${new Date().toLocaleString()}\n\n`;
    exportText += `Starting Balance: ₱${settings.startingBalance.toLocaleString()}\n`;
    exportText += `Current Balance: ₱${currentBalance.toLocaleString()}\n`;
    exportText += `Total Deducted: ₱${(settings.startingBalance - currentBalance).toLocaleString()}\n\n`;
    exportText += `TRANSACTION HISTORY\n`;
    exportText += `${'='.repeat(60)}\n\n`;

    transactions.forEach((t, i) => {
      exportText += `${i + 1}. ${new Date(t.date).toLocaleDateString()}\n`;
      exportText += `   ${t.description}\n`;
      exportText += `   Amount: ₱${t.amount.toLocaleString()}\n`;
      exportText += `   Status: ${t.status.toUpperCase()}\n`;
      exportText += `   Requested by: ${t.requestedBy === 'admin' ? settings.adminName : settings.approverName}\n`;
      if (t.notes) exportText += `   Notes: ${t.notes}\n`;
      if (t.approvedBy) exportText += `   Approved by: ${t.approvedBy} on ${new Date(t.approvedDate!).toLocaleString()}\n`;
      if (t.rejectedBy) exportText += `   Rejected by: ${t.rejectedBy} on ${new Date(t.rejectedDate!).toLocaleString()}\n`;
      exportText += `\n`;
    });

    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cash-tracker-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showAlert('success', 'Report downloaded! 📄');
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-PH', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge
  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </Badge>;
    }
  };

  // Get stats
  const pendingCount = transactions.filter(t => t.status === 'pending').length;
  const approvedCount = transactions.filter(t => t.status === 'approved').length;
  const totalDeducted = transactions
    .filter(t => t.status === 'approved')
    .reduce((sum, t) => sum + t.amount, 0);

  // Check if current user can approve a transaction
  const canApprove = (transaction: Transaction) => {
    if (transaction.status !== 'pending') return false;
    // Both admin and approver can approve any pending transaction
    return true;
  };

  // Login screen
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="py-12 text-center px-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-sm sm:text-base text-gray-600">Loading Cash Tracker...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center px-4 sm:px-6">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Wallet className="w-8 h-8 text-brand-orange" />
            </div>
            <CardTitle className="text-xl sm:text-2xl">Cash Tracker</CardTitle>
            <CardDescription className="text-sm">Enter your PIN to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6">
            <div className="space-y-2">
              <Label htmlFor="pin" className="text-sm">PIN Code</Label>
              <Input
                id="pin"
                type="password"
                inputMode="numeric"
                placeholder="Enter 4-digit PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="text-center text-xl sm:text-2xl tracking-widest"
                maxLength={4}
              />
            </div>
            <Button
              onClick={handleLogin}
              className="w-full text-base sm:text-lg py-5 sm:py-6"
              size="lg"
            >
              Login
            </Button>

            <div className="text-xs text-center text-muted-foreground space-y-1 pt-2">
              <p>👤 {settings.adminName} PIN: 1234</p>
              <p>👵 {settings.approverName} PIN: 5678</p>
              <p className="text-blue-600 mt-2">Both users can request & approve!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main app
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Alert */}
      {alert && (
        <Alert className={alert.type === 'success' ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-medium">{alert.message}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            💰 Cash Tracker
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Logged in as: {currentUser === 'admin' ? `👤 ${settings.adminName}` : `👵 ${settings.approverName}`}
          </p>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          {isSaving && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
              Saving...
            </Badge>
          )}
          <Button variant="outline" size="icon" onClick={() => setShowSettings(true)}>
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl">
        <CardContent className="pt-6 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0 mb-4">
            <div className="flex-1">
              <p className="text-white/90 text-sm font-medium">Current Balance</p>
              <div className="flex items-center gap-2 mt-1">
                {showBalance ? (
                  <h2 className="text-3xl sm:text-4xl font-bold text-white break-all">{formatCurrency(currentBalance)}</h2>
                ) : (
                  <h2 className="text-3xl sm:text-4xl font-bold text-white">₱ • • • • •</h2>
                )}
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-white/80 hover:text-white transition-colors flex-shrink-0"
                >
                  {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-white/90 text-xs">Starting</p>
              <p className="text-white font-semibold text-sm sm:text-base">{formatCurrency(settings.startingBalance)}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-white/30">
            <div>
              <p className="text-white/90 text-xs">Pending</p>
              <p className="text-lg sm:text-xl font-bold text-white">{pendingCount}</p>
            </div>
            <div>
              <p className="text-white/90 text-xs">Approved</p>
              <p className="text-lg sm:text-xl font-bold text-white">{approvedCount}</p>
            </div>
            <div>
              <p className="text-white/90 text-xs truncate">Deducted</p>
              <p className="text-sm sm:text-lg font-bold text-white truncate">{formatCurrency(totalDeducted)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Button
          onClick={() => setShowForm(!showForm)}
          size="lg"
          className="w-full text-base sm:text-lg py-5 sm:py-6"
        >
          <TrendingDown className="w-5 h-5 mr-2" />
          {showForm ? 'Cancel' : 'Request Deduction'}
        </Button>
        <Button
          onClick={handleExport}
          variant="outline"
          size="lg"
          className="text-base sm:text-lg py-5 sm:py-6"
        >
          <Download className="w-5 h-5 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Add Transaction Form */}
      {showForm && (
        <Card className="border-2 border-orange-300">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl">Request New Deduction</CardTitle>
            <CardDescription className="text-sm">Submit for the other person to approve</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm">Amount (₱) *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-base sm:text-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm">Description / Purpose *</Label>
              <Input
                id="description"
                placeholder="e.g., Water bill, Groceries"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional details or paste Facebook message..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="text-sm"
              />
            </div>

            <Button
              onClick={handleAddTransaction}
              className="w-full text-base sm:text-lg py-5 sm:py-6"
              size="lg"
            >
              Submit for Approval
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Transaction History */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <History className="w-4 h-4 sm:w-5 sm:h-5" />
                Transaction History
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {transactions.length} total transaction{transactions.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No transactions yet</p>
              <p className="text-sm">Add your first deduction to get started</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0 mb-2">
                    <div className="flex-1 w-full">
                      <div className="flex items-start sm:items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-semibold text-base sm:text-lg break-words">{transaction.description}</h4>
                        {getStatusBadge(transaction.status)}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(transaction.date)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Requested by: {transaction.requestedBy === 'admin' ? settings.adminName : settings.approverName}
                      </p>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto">
                      <p className="text-xl sm:text-2xl font-bold text-red-600">
                        -{formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>

                  {transaction.notes && (
                    <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                      <p className="text-gray-700 dark:text-gray-300">{transaction.notes}</p>
                    </div>
                  )}

                  {transaction.approvedBy && transaction.approvedDate && (
                    <p className="text-xs text-green-600 mt-2">
                      ✓ Approved by {transaction.approvedBy} on {formatDate(transaction.approvedDate)}
                    </p>
                  )}

                  {transaction.rejectedBy && transaction.rejectedDate && (
                    <p className="text-xs text-red-600 mt-2">
                      ✗ Rejected by {transaction.rejectedBy} on {formatDate(transaction.rejectedDate)}
                    </p>
                  )}

                  {/* Action buttons - can approve other person's pending requests */}
                  {canApprove(transaction) && (
                    <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-4">
                      <Button
                        onClick={() => handleEditTransaction(transaction)}
                        variant="outline"
                        className="w-full sm:flex-1"
                        size="lg"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleApprove(transaction.id)}
                        className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 text-white"
                        size="lg"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(transaction.id)}
                        variant="destructive"
                        className="w-full sm:flex-1"
                        size="lg"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-md sm:max-w-lg mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">⚙️ Settings</DialogTitle>
            <DialogDescription className="text-sm">
              Manage starting balance and reset data
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newBalance" className="text-sm">Update Starting Balance</Label>
              <Input
                id="newBalance"
                type="number"
                placeholder={settings.startingBalance.toString()}
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
                className="text-base sm:text-lg"
              />
              <p className="text-xs text-gray-500 break-words">
                Current starting balance: {formatCurrency(settings.startingBalance)}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleUpdateBalance}
                className="flex-1 text-sm sm:text-base"
                disabled={!newBalance}
              >
                <Settings className="w-4 h-4 mr-2" />
                Update Balance
              </Button>
            </div>

            <div className="border-t pt-4 mt-4">
              <h4 className="font-semibold text-red-600 mb-2 text-sm sm:text-base">⚠️ Danger Zone</h4>
              <Button
                onClick={handleReset}
                variant="destructive"
                className="w-full text-sm sm:text-base"
                size="lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset All Data
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                This will delete all transactions and reset to the new starting balance
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Transaction Dialog */}
      <Dialog open={!!editingTransaction} onOpenChange={() => setEditingTransaction(null)}>
        <DialogContent className="max-w-md sm:max-w-lg mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">✏️ Edit Transaction</DialogTitle>
            <DialogDescription className="text-sm">
              Correct the amount or description before approving
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editAmount" className="text-sm">Amount (₱)</Label>
              <Input
                id="editAmount"
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                className="text-base sm:text-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editDescription" className="text-sm">Description</Label>
              <Input
                id="editDescription"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editNotes" className="text-sm">Notes (Optional)</Label>
              <Textarea
                id="editNotes"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                rows={3}
                className="text-sm"
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setEditingTransaction(null)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="w-full sm:w-auto">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer Info */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
        <CardContent className="pt-6 px-4 sm:px-6">
          <div className="flex items-start gap-2 sm:gap-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs sm:text-sm text-blue-900 dark:text-blue-100">
              <p className="font-semibold mb-1">💡 How it works:</p>
              <ul className="space-y-1 text-blue-800 dark:text-blue-200">
                <li>• Both users can request deductions</li>
                <li>• Both users can edit, approve, or reject any pending request</li>
                <li>• Only approved transactions deduct from balance</li>
                <li>• Complete history saved with who requested & approved</li>
                <li>• Update starting balance anytime in Settings</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuntCashTracker;

























