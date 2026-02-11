import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, Compass, LineChart, Lock, Shield, Zap } from "lucide-react";
import {
  getCalculateRate,
  getLoanEligibility,
  getLoanProducts,
  getValidationRules,
} from "@/lib/api";

export const pickIcon = (product) => {
  const name = (product?.name || product?.title || "").toString().toLowerCase();
  if (name.includes("vehicle") || name.includes("car")) return Zap;
  if (
    name.includes("home") ||
    name.includes("bond") ||
    name.includes("mortgage")
  ) {
    return Compass;
  }
  if (name.includes("personal") || name.includes("unsecured")) return Activity;
  if (name.includes("secured") || name.includes("guarantee")) return Lock;
  if (name.includes("savings") || name.includes("investment")) return LineChart;
  return Shield;
};

const defaultEligibilityForm = {
  age: "",
  employmentStatus: "",
  employmentDuration: "",
  monthlyIncome: "",
  monthlyExpenses: "",
  creditScore: "",
  requestedAmount: "",
  loanTerm: "",
  loanPurpose: "",
};

const defaultRateForm = {
  loanAmount: "",
  loanTerm: "",
  creditScore: "",
  loanType: "",
};

export const useLoansLogic = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [rules, setRules] = useState(null);
  const [rulesLoading, setRulesLoading] = useState(false);
  const [rulesError, setRulesError] = useState("");
  const [eligibilityForm, setEligibilityForm] = useState(
    defaultEligibilityForm,
  );
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [lastEligibilityResult, setLastEligibilityResult] = useState(null);
  const [eligibilityLoading, setEligibilityLoading] = useState(false);
  const [eligibilityError, setEligibilityError] = useState("");
  const [eligibilityFieldErrors, setEligibilityFieldErrors] = useState({});
  const [rateForm, setRateForm] = useState(defaultRateForm);
  const [rateResult, setRateResult] = useState(null);
  const [rateLoading, setRateLoading] = useState(false);
  const [rateError, setRateError] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [applyNowRequested, setApplyNowRequested] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const payload = await getLoanProducts();
        const nextProducts = Array.isArray(payload?.products)
          ? payload.products
          : Array.isArray(payload)
            ? payload
            : [];

        if (isActive) {
          setProducts(nextProducts);
        }
      } catch (err) {
        if (isActive) {
          setError(err?.message || "Unable to load loan products right now.");
          setProducts([]);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const handleOpenDialog = () => {
      setApplyNowRequested(true);
    };

    window.addEventListener("open-loan-dialog", handleOpenDialog);
    return () =>
      window.removeEventListener("open-loan-dialog", handleOpenDialog);
  }, []);

  useEffect(() => {
    if (!dialogOpen) return;
    let isActive = true;

    const loadRules = async () => {
      try {
        setRulesLoading(true);
        setRulesError("");
        const payload = await getValidationRules();
        if (isActive) {
          setRules(payload);
        }
      } catch (err) {
        if (isActive) {
          setRulesError(err?.message || "Unable to load validation rules.");
        }
      } finally {
        if (isActive) {
          setRulesLoading(false);
        }
      }
    };

    loadRules();

    return () => {
      isActive = false;
    };
  }, [dialogOpen]);

  const startSimulator = useCallback(
    (product) => {
      const personalInfo = lastEligibilityResult?.personalInfo ?? {};
      const financialInfo = lastEligibilityResult?.financialInfo ?? {};
      setActiveProduct(product);
      setDialogOpen(true);
      setActiveStep(0);
      setEligibilityResult(null);
      setEligibilityError("");
      setEligibilityFieldErrors({});
      setRateResult(null);
      setRateError("");
      setSelectedProductId(product?.id ?? "");
      setEligibilityForm({
        age: personalInfo?.age ? String(personalInfo.age) : "30",
        employmentStatus: personalInfo?.employmentStatus || "employed",
        employmentDuration: personalInfo?.employmentDuration
          ? String(personalInfo.employmentDuration)
          : "12",
        monthlyIncome: "",
        monthlyExpenses: "",
        creditScore: financialInfo?.creditScore
          ? String(financialInfo.creditScore)
          : "650",
        requestedAmount: "",
        loanTerm: product?.minTerm ? String(product.minTerm) : "24",
        loanPurpose: product?.purposes?.[0] ?? "other",
      });
      setRateForm({
        loanAmount: product?.minAmount ? String(product.minAmount) : "",
        loanTerm: product?.minTerm ? String(product.minTerm) : "",
        creditScore: "",
        loanType: product?.id ?? "",
      });
    },
    [lastEligibilityResult],
  );

  useEffect(() => {
    if (!applyNowRequested) return;
    if (dialogOpen) {
      setApplyNowRequested(false);
      return;
    }
    if (products.length > 0) {
      startSimulator(products[0]);
      setApplyNowRequested(false);
    }
  }, [applyNowRequested, dialogOpen, products, startSimulator]);

  const handleEligibilityChange = useCallback(
    (field) => (event) => {
      setEligibilityForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    },
    [],
  );

  const handleRateChange = useCallback(
    (field) => (event) => {
      setRateForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    },
    [],
  );

  const submitEligibility = useCallback(
    async (event) => {
      event.preventDefault();
      setEligibilityLoading(true);
      setEligibilityError("");
      setEligibilityFieldErrors({});

      const nextErrors = {};
      const ageValue = Number(eligibilityForm.age);
      const employmentDurationValue = Number(
        eligibilityForm.employmentDuration,
      );
      const monthlyIncomeValue = Number(eligibilityForm.monthlyIncome);
      const monthlyExpensesValue = Number(eligibilityForm.monthlyExpenses);
      const creditScoreValue = eligibilityForm.creditScore
        ? Number(eligibilityForm.creditScore)
        : undefined;
      const requestedAmountValue = Number(eligibilityForm.requestedAmount);
      const loanTermValue = Number(eligibilityForm.loanTerm);

      if (rules?.personalInfo?.age?.required && !eligibilityForm.age) {
        nextErrors.age =
          rules.personalInfo.age.errorMessage || "Age is required.";
      } else if (Number.isFinite(ageValue)) {
        if (
          rules?.personalInfo?.age?.min != null &&
          ageValue < rules.personalInfo.age.min
        ) {
          nextErrors.age =
            rules.personalInfo.age.errorMessage || "Age is below minimum.";
        }
        if (
          rules?.personalInfo?.age?.max != null &&
          ageValue > rules.personalInfo.age.max
        ) {
          nextErrors.age =
            rules.personalInfo.age.errorMessage || "Age is above maximum.";
        }
      }

      if (
        rules?.personalInfo?.employmentStatus?.required &&
        !eligibilityForm.employmentStatus
      ) {
        nextErrors.employmentStatus =
          rules.personalInfo.employmentStatus.errorMessage ||
          "Employment status is required.";
      }

      if (
        rules?.personalInfo?.employmentDuration?.required &&
        !eligibilityForm.employmentDuration
      ) {
        nextErrors.employmentDuration =
          rules.personalInfo.employmentDuration.errorMessage ||
          "Employment duration is required.";
      } else if (
        rules?.personalInfo?.employmentDuration?.min != null &&
        employmentDurationValue < rules.personalInfo.employmentDuration.min
      ) {
        nextErrors.employmentDuration =
          rules.personalInfo.employmentDuration.errorMessage ||
          "Employment duration is too short.";
      }

      if (
        rules?.financialInfo?.monthlyIncome?.required &&
        !eligibilityForm.monthlyIncome
      ) {
        nextErrors.monthlyIncome =
          rules.financialInfo.monthlyIncome.errorMessage ||
          "Monthly income is required.";
      } else if (
        rules?.financialInfo?.monthlyIncome?.min != null &&
        monthlyIncomeValue < rules.financialInfo.monthlyIncome.min
      ) {
        nextErrors.monthlyIncome =
          rules.financialInfo.monthlyIncome.errorMessage ||
          "Monthly income is too low.";
      }

      if (
        rules?.financialInfo?.monthlyExpenses?.required &&
        !eligibilityForm.monthlyExpenses
      ) {
        nextErrors.monthlyExpenses =
          rules.financialInfo.monthlyExpenses.errorMessage ||
          "Monthly expenses are required.";
      } else if (
        rules?.financialInfo?.monthlyExpenses?.min != null &&
        monthlyExpensesValue < rules.financialInfo.monthlyExpenses.min
      ) {
        nextErrors.monthlyExpenses =
          rules.financialInfo.monthlyExpenses.errorMessage ||
          "Monthly expenses are too low.";
      }

      if (creditScoreValue != null) {
        if (
          rules?.financialInfo?.creditScore?.min != null &&
          creditScoreValue < rules.financialInfo.creditScore.min
        ) {
          nextErrors.creditScore =
            rules.financialInfo.creditScore.errorMessage ||
            "Credit score is too low.";
        }
        if (
          rules?.financialInfo?.creditScore?.max != null &&
          creditScoreValue > rules.financialInfo.creditScore.max
        ) {
          nextErrors.creditScore =
            rules.financialInfo.creditScore.errorMessage ||
            "Credit score is too high.";
        }
      }

      if (
        rules?.loanDetails?.requestedAmount?.required &&
        !eligibilityForm.requestedAmount
      ) {
        nextErrors.requestedAmount =
          rules.loanDetails.requestedAmount.errorMessage ||
          "Loan amount is required.";
      } else if (Number.isFinite(requestedAmountValue)) {
        if (
          rules?.loanDetails?.requestedAmount?.min != null &&
          requestedAmountValue < rules.loanDetails.requestedAmount.min
        ) {
          nextErrors.requestedAmount =
            rules.loanDetails.requestedAmount.errorMessage ||
            "Loan amount is below minimum.";
        }
        if (
          rules?.loanDetails?.requestedAmount?.max != null &&
          requestedAmountValue > rules.loanDetails.requestedAmount.max
        ) {
          nextErrors.requestedAmount =
            rules.loanDetails.requestedAmount.errorMessage ||
            "Loan amount is above maximum.";
        }
      }

      if (rules?.loanDetails?.loanTerm?.required && !eligibilityForm.loanTerm) {
        nextErrors.loanTerm =
          rules.loanDetails.loanTerm.errorMessage || "Loan term is required.";
      } else if (Number.isFinite(loanTermValue)) {
        if (
          rules?.loanDetails?.loanTerm?.min != null &&
          loanTermValue < rules.loanDetails.loanTerm.min
        ) {
          nextErrors.loanTerm =
            rules.loanDetails.loanTerm.errorMessage ||
            "Loan term is below minimum.";
        }
        if (
          rules?.loanDetails?.loanTerm?.max != null &&
          loanTermValue > rules.loanDetails.loanTerm.max
        ) {
          nextErrors.loanTerm =
            rules.loanDetails.loanTerm.errorMessage ||
            "Loan term exceeds maximum.";
        }
      }

      if (Object.keys(nextErrors).length > 0) {
        setEligibilityFieldErrors(nextErrors);
        setEligibilityLoading(false);
        return;
      }

      try {
        const payload = {
          personalInfo: {
            age: ageValue || 0,
            employmentStatus: eligibilityForm.employmentStatus || "employed",
            employmentDuration: employmentDurationValue || 0,
          },
          financialInfo: {
            monthlyIncome: monthlyIncomeValue || 0,
            monthlyExpenses: monthlyExpensesValue || 0,
            creditScore: creditScoreValue,
          },
          loanDetails: {
            requestedAmount: requestedAmountValue || 0,
            loanTerm: loanTermValue || 0,
            loanPurpose:
              eligibilityForm.loanPurpose || activeProduct?.purposes?.[0],
          },
        };

        const response = await getLoanEligibility(payload);
        setEligibilityResult(response);
        setLastEligibilityResult(response);
        setRateForm((prev) => ({
          ...prev,
          loanAmount: eligibilityForm.requestedAmount,
          loanTerm: eligibilityForm.loanTerm,
          creditScore: eligibilityForm.creditScore,
          loanType: activeProduct?.id ?? prev.loanType,
        }));
        setActiveStep(1);
      } catch (err) {
        setEligibilityError(err?.message || "Eligibility check failed.");
      } finally {
        setEligibilityLoading(false);
      }
    },
    [activeProduct?.id, activeProduct?.purposes, eligibilityForm, rules],
  );

  const submitRate = useCallback(async (event) => {
    event.preventDefault();
    setRateLoading(true);
    setRateError("");
    try {
      const response = await getCalculateRate();
      setRateResult(response);
      setActiveStep(3);
    } catch (err) {
      setRateError(err?.message || "Rate calculation failed.");
    } finally {
      setRateLoading(false);
    }
  }, []);

  const items = useMemo(
    () =>
      (products ?? []).map((product, index) => {
        const title =
          product?.name || product?.title || `Loan product ${index + 1}`;
        const description =
          product?.description ||
          "Flexible financing options tailored to your needs.";

        return {
          key: product?.id || title,
          title,
          description,
          icon: pickIcon(product),
          index,
          product,
          minAmount: product?.minAmount,
          maxAmount: product?.maxAmount,
          minTerm: product?.minTerm,
          maxTerm: product?.maxTerm,
          rateMin: product?.interestRateRange?.min,
          rateMax: product?.interestRateRange?.max,
          purposes: Array.isArray(product?.purposes) ? product.purposes : [],
        };
      }),
    [products],
  );

  const stepLabels = [
    "Eligibility check",
    "Loan products",
    "Rate calculator",
    "Review responses",
  ];
  const employmentOptions = rules?.personalInfo?.employmentStatus?.options ?? [
    "employed",
    "self_employed",
    "unemployed",
    "retired",
  ];
  const purposeOptions = Array.from(
    new Set([
      "new_vehicle",
      "used_vehicle",
      ...(activeProduct?.purposes ?? ["other"]),
    ]),
  );
  const filteredProducts = useMemo(() => products ?? [], [products]);

  const handleSelectProduct = useCallback((product) => {
    setSelectedProductId(product?.id ?? "");
    setRateForm((prev) => ({
      ...prev,
      loanType: product?.id ?? prev.loanType,
      loanAmount:
        prev.loanAmount ||
        (product?.minAmount ? String(product.minAmount) : ""),
      loanTerm:
        prev.loanTerm || (product?.minTerm ? String(product.minTerm) : ""),
    }));
  }, []);

  useEffect(() => {
    if (!dialogOpen || filteredProducts.length === 0) return;
    if (
      !selectedProductId ||
      !filteredProducts.some((product) => product.id === selectedProductId)
    ) {
      handleSelectProduct(filteredProducts[0]);
    }
  }, [dialogOpen, filteredProducts, selectedProductId, handleSelectProduct]);

  return {
    products,
    loading,
    error,
    dialogOpen,
    setDialogOpen,
    activeProduct,
    activeStep,
    setActiveStep,
    rules,
    rulesLoading,
    rulesError,
    eligibilityForm,
    setEligibilityForm,
    eligibilityResult,
    lastEligibilityResult,
    eligibilityLoading,
    eligibilityError,
    eligibilityFieldErrors,
    rateForm,
    setRateForm,
    rateResult,
    rateLoading,
    rateError,
    selectedProductId,
    applyNowRequested,
    items,
    stepLabels,
    employmentOptions,
    purposeOptions,
    filteredProducts,
    startSimulator,
    handleEligibilityChange,
    handleRateChange,
    submitEligibility,
    submitRate,
    handleSelectProduct,
    setApplyNowRequested,
  };
};
