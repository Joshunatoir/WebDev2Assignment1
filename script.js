/**
 * Joshua, Edison, Justin
 * Date: May 30, 2026
 * Assignment: Advanced JavaScript and Tailwind CSS - Unit Converter
 * * Program Description:
 * This web application provides an interactive interface for converting values between metric and imperial systems. 
 * The program accepts inputs from the user consisting of either a single numeric value or a comma-separated list of values via web forms. 
 * Processing is handled by a higher-order factory function that returns specialized arrow-notation functions to dynamically evaluate single data values or mapped array datasets. 
 * The final calculated results are rounded to four decimal places and rendered directly back to the responsive User Interface.
 * Users can seamlessly switch between specialized forms using navigation tabs dedicated to Weight, Distance, and Temperature conversions.
 */

// =========================================================================
// 1. CORE ARCHITECTURE: HIGHER-ORDER CONVERSION FACTORY
// =========================================================================

const createConverter = (fromUnit, toUnit) => {
  const convertValue = (val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return null;

    switch (`${fromUnit}->${toUnit}`.toLowerCase()) {
      case "lbs->kg": return num * 0.45359237;
      case "kg->lbs": return num / 0.45359237;
      case "mi->km":  return num * 1.609344;
      case "km->mi":  return num / 1.609344;
      case "c->f":   return (num * 9) / 5 + 32;
      case "f->c":   return ((num - 32) * 5) / 9;
      default:
        console.error(`Formula from ${fromUnit} to ${toUnit} is not defined.`);
        return num;
    }
  };

  return (input) => {
    if (Array.isArray(input)) {
      return input.map((val) => {
        const res = convertValue(val);
        return res !== null ? Number(res.toFixed(4)) : "Invalid";
      });
    } else {
      const res = convertValue(input);
      return res !== null ? Number(res.toFixed(4)) : "Invalid";
    }
  };
};

// =========================================================================
// 2. INITIALIZE CONVERTER INSTANCES
// =========================================================================
const lbsToKg = createConverter("lbs", "kg");
const kgToLbs = createConverter("kg", "lbs");
const miToKm  = createConverter("mi", "km");
const kmToMi  = createConverter("km", "mi");
const cToF    = createConverter("c", "f");
const fToC    = createConverter("f", "c");

// =========================================================================
// 3. UI SWITCHING HANDLER & INTERACTION LAYER
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
  
  // --- Helper: Parse Input Types (Single String vs List Arrays) ---
  const parseFormInput = (rawInput) => {
    if (rawInput.includes(",")) {
      return rawInput.split(",").map((item) => item.trim()).filter((item) => item !== "");
    }
    return rawInput.trim();
  };

  // --- UI Elements ---
  const btnWeight = document.getElementById("btn-weight");
  const btnDistance = document.getElementById("btn-distance");
  const btnTemperature = document.getElementById("btn-temperature");

  const secWeight = document.getElementById("section-weight");
  const secDistance = document.getElementById("section-distance");
  const secTemperature = document.getElementById("section-temperature");

  const allTabs = document.querySelectorAll(".tab-link");

  // --- Dynamic Tab Display & Navigation Accent Toggle ---
  const switchTab = (activeSection, clickedTabButton) => {
    secWeight.classList.replace("block", "hidden");
    secDistance.classList.replace("block", "hidden");
    secTemperature.classList.replace("block", "hidden");

    activeSection.classList.replace("hidden", "block");

    allTabs.forEach((tab) => {
      tab.classList.remove("text-blue-600", "border-b-2", "border-blue-600", "pb-1");
      tab.classList.add("text-gray-500");
    });

    clickedTabButton.classList.remove("text-gray-500");
    clickedTabButton.classList.add("text-blue-600", "border-b-2", "border-blue-600", "pb-1");
  };

  if (btnWeight) btnWeight.addEventListener("click", (e) => { e.preventDefault(); switchTab(secWeight, e.currentTarget); });
  if (btnDistance) btnDistance.addEventListener("click", (e) => { e.preventDefault(); switchTab(secDistance, e.currentTarget); });
  if (btnTemperature) btnTemperature.addEventListener("click", (e) => { e.preventDefault(); switchTab(secTemperature, e.currentTarget); });

  // =========================================================================
  // 4. AUTOMATED FORM PROCESSORS ENGINE
  // =========================================================================
  const setupFormSubmission = (formId, inputId, outputId, conversionFunction) => {
    const formElement = document.getElementById(formId);
    if (!formElement) return;

    formElement.addEventListener("submit", (e) => {
      e.preventDefault();
      const rawInput = document.getElementById(inputId).value.trim();
      const outputElement = document.getElementById(outputId);

      if (!rawInput) {
        outputElement.textContent = "Please enter data";
        return;
      }

      const parsedData = parseFormInput(rawInput);
      let finalResult;

      if (Array.isArray(parsedData)) {
        const numericArray = parsedData.map(val => parseFloat(val));
        finalResult = conversionFunction(numericArray).join(", ");
      } else {
        finalResult = conversionFunction(parseFloat(parsedData));
      }

      outputElement.textContent = finalResult;
    });
  };

  // Wire up all 6 forms dynamically to their respective calculation factories
  setupFormSubmission("form-lbs-to-kg", "input-lbs", "result-kg", lbsToKg);
  setupFormSubmission("form-kg-to-lbs", "input-kg", "result-lbs", kgToLbs);
  setupFormSubmission("form-mi-to-km",  "input-mi", "result-km", miToKm);
  setupFormSubmission("form-km-to-mi",  "input-km-dist", "result-mi", kmToMi);
  setupFormSubmission("form-c-to-f",    "input-c",  "result-f",   cToF);
  setupFormSubmission("form-f-to-c",    "input-f",  "result-c",   fToC);
});