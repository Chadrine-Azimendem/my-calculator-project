import React, { useState } from "react";
import "./App.css";
// import { evaluate } from "mathjs";

const toLocaleString = (num) =>
  String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");
const removeSpaces = (num) => num.toString().replace(/\s/g, "");

const btnValues = [
  ["C", "+-", "%", "/"],
  [7, 8, 9, "*"],
  [4, 5, 6, "-"],
  [1, 2, 3, "+"],
  [0, ".", "="],
];

const App = () => {
  const [operation, setoperation] = useState({
    sign: "",
    number: 0,
    result: 0,
  });

  const numClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;

    if (removeSpaces(operation.number).length < 16) {
      setoperation({
        ...operation,
        number:
          operation.number === 0 && value === "0"
            ? "0"
            : removeSpaces(operation.number) % 1 === 0
            ? toLocaleString(Number(removeSpaces(operation.number + value)))
            : toLocaleString(operation.number + value),
        result: !operation.sign ? 0 : operation.result,
      });
    }
  };

  const commaClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;

    setoperation({
      ...operation,
      number: !operation.number.toString().includes(".")
        ? operation.number + value
        : operation.number,
    });
  };

  const signClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;

    setoperation({
      ...operation,
      sign: value,
      result:
        !operation.result && operation.number
          ? operation.number
          : operation.result,
      number: 0,
    });
  };

  const equalsClickHandler = () => {
    if (operation.sign && operation.number) {
      const math = (a, b, sign) =>
        sign === "+"
          ? a + b
          : sign === "-"
          ? a - b
          : sign === "*"
          ? a * b
          : a / b;

      setoperation({
        ...operation,
        result:
          operation.number === "0" && operation.sign === "/"
            ? "Can't divide with 0"
            : math(
                Number(operation.result),
                Number(operation.number),
                operation.sign
              ),
        sign: "",
        number: 0,
      });
    }
  };

  const inverseClickHandler = () => {
    setoperation({
      ...operation,
      number: operation.number ? operation.number * -1 : 0,
      result: operation.result ? operation.result * -1 : 0,
      sign: "",
    });
  };

  const percentClickHandler = () => {
    let num = operation.number ? parseFloat(operation.number) : 0;
    let res = operation.result ? parseFloat(operation.result) : 0;

    setoperation({
      ...operation,
      number: (num /= Math.pow(100, 1)),
      result: (res /= Math.pow(100, 1)),
      sign: "",
    });
  };

  const resetClickHandler = () => {
    setoperation({
      ...operation,
      sign: "",
      number: 0,
      result: 0,
    });
  };

  // dispay operation sumary (to be fixed)
  const handleOpSummary = () => {
    if (operation.number) {
      return operation.number;
    } else if (operation.number && operation.sign) {
      return `${operation.number} ${operation.sign}`;
    } else if (operation.number && operation.sign && operation.result) {
      return `(${operation.result} ${operation.sign} ${operation.number} = ${operation.result})`;
    }
  };

  return (
    <>
      <div className="main-wrapper">
        <Screen
          opSumary={handleOpSummary()}
          value={operation.number ? operation.number : operation.result}
        />
        <div className="btns-wrapper">
          {/* dispay the calculators buttons */}
          {btnValues.flat().map((btnText, index) => {
            return (
              <Button
                key={index}
                className=""
                value={btnText}
                onClick={
                  btnText === "C"
                    ? resetClickHandler
                    : btnText === "+-"
                    ? inverseClickHandler
                    : btnText === "%"
                    ? percentClickHandler
                    : btnText === "="
                    ? equalsClickHandler
                    : btnText === "/" ||
                      btnText === "*" ||
                      btnText === "-" ||
                      btnText === "+"
                    ? signClickHandler
                    : btnText === "."
                    ? commaClickHandler
                    : numClickHandler
                }
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

const Screen = (props) => {
  return (
    <>
      <div className="screen">
        <p className="sumary">{props.opSumary}</p>
        <p>{props.value}</p>
      </div>
    </>
  );
};

const Button = (props) => {
  return (
    <button className={props.className} onClick={props.onClick}>
      {props.value}
    </button>
  );
};

export default App;
