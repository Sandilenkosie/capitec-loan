import { useLoansLogic } from './logic';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Loans = () => {
  const {
    dialogOpen,
    setDialogOpen,
    activeProduct,
    activeStep,
    setActiveStep,
    rulesLoading,
    rulesError,
    eligibilityForm,
    eligibilityResult,
    eligibilityLoading,
    eligibilityError,
    eligibilityFieldErrors,
    rateForm,
  rateResult,
  rateLoading,
  rateError,
  setRateForm,
    selectedProductId,
    stepLabels,
    filteredProducts,
    products,
    handleEligibilityChange,
    handleRateChange,
    submitEligibility,
    submitRate,
    handleSelectProduct,
  } = useLoansLogic();

  return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Loan eligibility simulator</DialogTitle>
            <DialogDescription>
              Follow the steps to check eligibility, review products, calculate a rate, and
              see all API responses for{activeProduct?.name ? ` ${activeProduct.name}` : ' your loan'}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            {stepLabels.map((label, index) => (
              <div
                key={label}
                className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                  activeStep === index
                    ? 'bg-capitec-blue text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                <span>{index + 1}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="max-h-[65vh] overflow-y-auto pr-2">

          {activeStep === 0 && (
            <form className="space-y-4" onSubmit={submitEligibility}>
              {rulesLoading ? (
                <p className="text-sm text-gray-500">Loading validation rules…</p>
              ) : rulesError ? (
                <p className="text-sm text-red-500">{rulesError}</p>
              ) : null}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="monthlyIncome">Monthly income (R)</Label>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    value={eligibilityForm.monthlyIncome}
                    onChange={handleEligibilityChange('monthlyIncome')}
                    placeholder="e.g. 25000"
                  />
                  {eligibilityFieldErrors.monthlyIncome && (
                    <p className="text-xs text-red-500">{eligibilityFieldErrors.monthlyIncome}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyExpenses">Monthly expenses (R)</Label>
                  <Input
                    id="monthlyExpenses"
                    type="number"
                    value={eligibilityForm.monthlyExpenses}
                    onChange={handleEligibilityChange('monthlyExpenses')}
                    placeholder="e.g. 12000"
                  />
                  {eligibilityFieldErrors.monthlyExpenses && (
                    <p className="text-xs text-red-500">{eligibilityFieldErrors.monthlyExpenses}</p>
                  )}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="requestedAmount">Requested amount (R)</Label>
                  <Input
                    id="requestedAmount"
                    type="number"
                    value={eligibilityForm.requestedAmount}
                    onChange={handleEligibilityChange('requestedAmount')}
                    placeholder="e.g. 150000"
                  />
                  {eligibilityFieldErrors.requestedAmount && (
                    <p className="text-xs text-red-500">{eligibilityFieldErrors.requestedAmount}</p>
                  )}
                </div>
              </div>
              {eligibilityError && <p className="text-sm text-red-500">{eligibilityError}</p>}
              {eligibilityResult && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-600">
                  Eligibility response received. Continue to view loan products.
                </div>
              )}
              <DialogFooter>
                <Button type="submit" disabled={eligibilityLoading}>
                  {eligibilityLoading ? 'Checking…' : 'Check eligibility'}
                </Button>
              </DialogFooter>
            </form>
          )}

          {activeStep === 1 && (
            <div className="space-y-4">
              {filteredProducts.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
                  No products match the selected purpose. Try another purpose.
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => handleSelectProduct(product)}
                      className={`flex items-start gap-3 rounded-xl border bg-white/70 p-4 text-left transition ${
                        selectedProductId === product.id
                          ? 'border-capitec-blue/60 ring-1 ring-capitec-blue/30'
                          : 'border-gray-200 hover:border-capitec-blue/30'
                      }`}
                    >
                      <Checkbox
                        checked={selectedProductId === product.id}
                        onCheckedChange={() => handleSelectProduct(product)}
                        className="mt-1"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.description}</p>
                        <div className="mt-3 grid gap-2 text-xs text-gray-500">
                          <div>Amount: R{product.minAmount} - R{product.maxAmount}</div>
                          <div>Term: {product.minTerm} - {product.maxTerm} months</div>
                          <div>Rates: {product.interestRateRange?.min}% - {product.interestRateRange?.max}%</div>
                          <div>
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                              Purpose
                            </span>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {Array.isArray(product.purposes) && product.purposes.length > 0 ? (
                                product.purposes.map((purpose) => (
                                  <span
                                    key={purpose}
                                    className="text-[0.7rem] font-medium text-capitec-blue bg-capitec-blue/10 px-2.5 py-1 rounded-full"
                                  >
                                    {purpose.replace(/_/g, ' ')}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[0.7rem] font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                                  Multiple
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setActiveStep(0)}>
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  disabled={!selectedProductId}
                >
                  Continue to rate
                </Button>
              </DialogFooter>
            </div>
          )}

          {activeStep === 2 && (
            <form className="space-y-4" onSubmit={submitRate}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="loanAmount">Loan amount (R)</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    value={rateForm.loanAmount}
                    onChange={handleRateChange('loanAmount')}
                    placeholder="e.g. 150000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rateLoanTerm">Loan term (months)</Label>
                  <Input
                    id="rateLoanTerm"
                    type="number"
                    value={rateForm.loanTerm}
                    onChange={handleRateChange('loanTerm')}
                    placeholder="e.g. 24"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rateCreditScore">Credit score</Label>
                  <Input
                    id="rateCreditScore"
                    type="number"
                    value={rateForm.creditScore}
                    onChange={handleRateChange('creditScore')}
                    placeholder="e.g. 650"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Loan type</Label>
                  <Select
                    value={rateForm.loanType}
                    onValueChange={(value) => setRateForm((prev) => ({ ...prev, loanType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select loan type" />
                    </SelectTrigger>
                    <SelectContent>
                      {(products ?? []).map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name || product.title || product.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {rateError && <p className="text-sm text-red-500">{rateError}</p>}
              {rateResult && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-600">
                  Rate response received. Continue to review responses.
                </div>
              )}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setActiveStep(1)}>
                  Back
                </Button>
                <Button type="submit" disabled={rateLoading}>
                  {rateLoading ? 'Calculating…' : 'Calculate rate'}
                </Button>
              </DialogFooter>
            </form>
          )}

          {activeStep === 3 && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-capitec-blue/10 bg-white/80 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[0.7rem] uppercase tracking-[0.3em] text-gray-400">Capitec Loan Snapshot</p>
                    <h3 className="mt-2 text-lg font-semibold text-gray-900">Review your eligibility & rate</h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Here’s a clear summary of the responses so you can make a confident decision.
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-4 py-1 text-xs font-semibold shadow-sm ${
                      eligibilityResult?.eligibilityResult?.isEligible
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {eligibilityResult?.eligibilityResult?.isEligible ? 'Likely eligible' : 'Needs review'}
                  </span>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-gray-50/60 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800">Eligibility response</h4>
                      <p className="mt-1 text-xs text-gray-500">Highlights from the eligibility engine.</p>
                    </div>
                    <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-capitec-blue bg-capitec-blue/10 px-3 py-1 rounded-full">
                      Outcome
                    </span>
                  </div>
                  {eligibilityResult ? (
                    <div className="mt-4 grid gap-4 text-xs text-gray-600">
                      <div className="rounded-xl border border-white/70 bg-white/80 p-4">
                        <div className="text-[0.7rem] font-semibold uppercase tracking-wide text-gray-400">
                          Eligibility outcome
                        </div>
                        <div className="mt-2 text-base font-semibold text-gray-900">
                          {eligibilityResult.eligibilityResult?.isEligible ? 'Eligible' : 'Not eligible'}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {eligibilityResult.eligibilityResult?.decisionReason || 'We are reviewing your application details.'}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="text-[0.7rem] font-medium text-capitec-blue bg-capitec-blue/10 px-3 py-1 rounded-full">
                            Approval likelihood: {eligibilityResult.eligibilityResult?.approvalLikelihood ?? '—'}%
                          </span>
                          <span className="text-[0.7rem] font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                            Risk: {eligibilityResult.eligibilityResult?.riskCategory ?? '—'}
                          </span>
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-xl border border-white/70 bg-white/80 p-4">
                          <div className="text-[0.7rem] font-semibold uppercase tracking-wide text-gray-400">
                            Recommended loan
                          </div>
                          <div className="mt-2 grid gap-2">
                            <div className="flex items-center justify-between">
                              <span>Recommended</span>
                              <span className="font-semibold">R{eligibilityResult.recommendedLoan?.recommendedAmount ?? '—'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Maximum</span>
                              <span className="font-semibold">R{eligibilityResult.recommendedLoan?.maxAmount ?? '—'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Interest</span>
                              <span className="font-semibold">{eligibilityResult.recommendedLoan?.interestRate ?? '—'}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Monthly</span>
                              <span className="font-semibold">R{eligibilityResult.recommendedLoan?.monthlyPayment ?? '—'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-xl border border-white/70 bg-white/80 p-4">
                          <div className="text-[0.7rem] font-semibold uppercase tracking-wide text-gray-400">
                            Affordability
                          </div>
                          <div className="mt-2 grid gap-2">
                            <div className="flex items-center justify-between">
                              <span>Disposable</span>
                              <span className="font-semibold">R{eligibilityResult.affordabilityAnalysis?.disposableIncome ?? '—'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Debt ratio</span>
                              <span className="font-semibold">{eligibilityResult.affordabilityAnalysis?.debtToIncomeRatio ?? '—'}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Loan ratio</span>
                              <span className="font-semibold">{eligibilityResult.affordabilityAnalysis?.loanToIncomeRatio ?? '—'}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Score</span>
                              <span className="font-semibold capitalize">
                                {eligibilityResult.affordabilityAnalysis?.affordabilityScore ?? '—'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                                    <div className="rounded-2xl border border-capitec-blue/10 bg-capitec-blue/5 p-5">
                <h5 className="text-sm font-semibold text-gray-800">Next steps with Capitec</h5>
                <p className="mt-2 text-xs text-gray-600">
                  Keep your payslips, ID, and proof of address ready. You can refine your inputs or proceed with confidence.
                </p>
                <ul className="mt-3 grid gap-2 text-xs text-gray-600">
                  <li>• Compare products and confirm the loan purpose.</li>
                  <li>• Review affordability to align with your monthly budget.</li>
                  <li>• Contact Capitec for a personalised offer.</li>
                </ul>
              </div>
                    </div>
                  ) : (
                    <p className="mt-3 text-xs text-gray-500">No eligibility response yet.</p>
                  )}
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50/60 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800">Rate response</h4>
                      <p className="mt-1 text-xs text-gray-500">Your estimated repayment and rate details.</p>
                    </div>
                    <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-capitec-blue bg-capitec-blue/10 px-3 py-1 rounded-full">
                      Pricing
                    </span>
                  </div>
                  {rateResult ? (
                    <div className="mt-4 grid gap-4 text-xs text-gray-600">
                      <div className="rounded-xl border border-white/70 bg-white/80 p-4">
                        <div className="text-[0.7rem] font-semibold uppercase tracking-wide text-gray-400">
                          Your inputs
                        </div>
                        <div className="mt-2 grid gap-2">
                          <div className="flex items-center justify-between">
                            <span>Loan amount</span>
                            <span className="font-semibold">R{rateForm.loanAmount || '—'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Loan term</span>
                            <span className="font-semibold">{rateForm.loanTerm || '—'} months</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Credit score</span>
                            <span className="font-semibold">{rateForm.creditScore || '—'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl border border-white/70 bg-white/80 p-4">
                        <div className="text-[0.7rem] font-semibold uppercase tracking-wide text-gray-400">
                          Estimated repayment
                        </div>
                        <div className="mt-2 grid gap-2">
                          <div className="flex items-center justify-between">
                            <span>Interest rate</span>
                            <span className="font-semibold">{rateResult.interestRate ?? '—'}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Monthly payment</span>
                            <span className="font-semibold">R{rateResult.monthlyPayment ?? '—'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Total interest</span>
                            <span className="font-semibold">R{rateResult.totalInterest ?? '—'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Total repayment</span>
                            <span className="font-semibold">R{rateResult.totalRepayment ?? '—'}</span>
                          </div>
                        </div>
                      </div>

                      {Array.isArray(rateResult.paymentSchedule) && rateResult.paymentSchedule.length > 0 ? (
                        <div className="rounded-xl border border-white/70 bg-white/80 p-4">
                          <div className="text-[0.7rem] font-semibold uppercase tracking-wide text-gray-400">
                            Payment schedule (first 2)
                          </div>
                          <div className="mt-2 grid gap-3">
                            {rateResult.paymentSchedule.slice(0, 2).map((entry) => (
                              <div key={entry.month} className="rounded-lg border border-gray-100 bg-white p-3">
                                <div className="text-xs font-semibold text-gray-700">Month {entry.month}</div>
                                <div className="mt-2 grid gap-1">
                                  <div className="flex items-center justify-between">
                                    <span>Payment</span>
                                    <span className="font-semibold">R{entry.payment ?? '—'}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span>Principal</span>
                                    <span className="font-semibold">R{entry.principal ?? '—'}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span>Interest</span>
                                    <span className="font-semibold">R{entry.interest ?? '—'}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span>Balance</span>
                                    <span className="font-semibold">R{entry.balance ?? '—'}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <p className="mt-3 text-xs text-gray-500">No rate response yet.</p>
                  )}
                </div>
              </div>


              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setActiveStep(2)}>
                  Back
                </Button>
                <Button type="button" onClick={() => setDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
          </div>
        </DialogContent>
      </Dialog>
  );
};

export default Loans;
