function be_sum_to_n_a(n: number): number {
  // Complexity: On
	if (n === 1) {
    return 1;
  }
  let total = 0;
  for (let i = 0; i <= n; i++) {
    total += i;
  }
  return total;
}

function be_sum_to_n_b(n: number): number {
  // Complexity: O1
	if (n === 1) {
    return 1;
  }
  return n * (n + 1) / 2;
}

function be_sum_to_n_c(n: number): number {
	// Complexity: On
  if (n === 1) {
    return 1;
  }
  return n + be_sum_to_n_c(n - 1);
}