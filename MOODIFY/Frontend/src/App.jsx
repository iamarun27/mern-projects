import { useState } from "react";

import FaceExpression from "./features/Expression/component/FaceExpression";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <FaceExpression />
    </>
  );
}

export default App;
