var fe_sum_to_n_a = function(n) {
  if (n === 1) {
    return 1;
  }
  var total = 0;
  for (var i = 0; i <= n; i++) {
    total += i;
  }
  return total;
};

var fe_sum_to_n_b = function(n) {
  if (n === 1) {
    return 1;
  }
  return n * (n + 1) / 2;
};

var fe_sum_to_n_c = function(n) {
  if (n === 1) {
    return 1;
  }
  return n + fe_sum_to_n_c(n - 1);
};

console.log(fe_sum_to_n_a(10));