// BUILD FILTER QUERY

export const buildFilterFormQuery = (formData) => {
  const filters = [];

  // Process yearOfBirth - use EQUAL operator
  if (formData.yearOfBirth) {
    filters.push({
      key: "yearOfBirth",
      operator: "EQUAL",
      fieldType: "INTEGER",
      value: formData.yearOfBirth,
    });
  }

  // Process dateOfDeath - use EQUAL operator
  if (formData.dateOfDeath) {
    filters.push({
      key: "dateOfDeath",
      operator: "EQUAL",
      fieldType: "INTEGER",
      value: formData.dateOfDeath,
    });
  }

  // Process homeTown - use LIKE operator
  if (formData.homeTown) {
    filters.push({
      key: "homeTown",
      operator: "LIKE",
      fieldType: "STRING",
      value: formData.homeTown,
    });
  }

  // Process areaName - use EQUAL operator
  if (formData["graveRow.areaName"]) {
    filters.push({
      key: "graveRow.areaName",
      operator: "EQUAL",
      fieldType: "STRING",
      value: formData["graveRow.areaName"],
    });
  }

  // Process rowName - use EQUAL operator
  if (formData["graveRow.rowName"]) {
    filters.push({
      key: "graveRow.rowName",
      operator: "EQUAL",
      fieldType: "STRING",
      value: formData["graveRow.rowName"],
    });
  }

  return filters;
};
