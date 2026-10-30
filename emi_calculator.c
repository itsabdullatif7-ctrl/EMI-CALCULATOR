#include <math.h>
#include <stdio.h>

int main(void) {
    double principal;
    double annual_rate;
    double tenure_years;

    printf("EMI Calculator\n");
    printf("Loan amount: ");
    if (scanf("%lf", &principal) != 1 || principal <= 0) {
        fprintf(stderr, "Please enter a loan amount greater than zero.\n");
        return 1;
    }

    printf("Annual interest rate (%%): ");
    if (scanf("%lf", &annual_rate) != 1 || annual_rate < 0 || annual_rate > 100) {
        fprintf(stderr, "Please enter an interest rate from 0 to 100.\n");
        return 1;
    }

    printf("Loan tenure (years): ");
    if (scanf("%lf", &tenure_years) != 1 || tenure_years <= 0 || tenure_years > 100) {
        fprintf(stderr, "Please enter a tenure greater than 0 and no more than 100 years.\n");
        return 1;
    }

    const double months = tenure_years * 12.0;
    const double monthly_rate = annual_rate / 1200.0;
    const double emi = monthly_rate == 0.0
        ? principal / months
        : principal * monthly_rate * pow(1.0 + monthly_rate, months)
            / (pow(1.0 + monthly_rate, months) - 1.0);
    const double total_payment = emi * months;
    const double total_interest = total_payment - principal;

    printf("\nMonthly EMI:     Rs. %.2f\n", emi);
    printf("Principal:       Rs. %.2f\n", principal);
    printf("Total interest:  Rs. %.2f\n", total_interest);
    printf("Total repayment: Rs. %.2f\n", total_payment);
    printf("Number of EMIs:  %.0f\n", months);

    return 0;
}
