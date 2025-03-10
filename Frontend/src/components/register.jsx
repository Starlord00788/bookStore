

import React from 'react'

const Register = () => {
  return (
    <>
       <div>
       <div className="mbsc-row">
    <div className="mbsc-col-12 mbsc-col-md-6 mbsc-col-lg-3">
        <Input label="Email" inputStyle="box" labelStyle="floating" placeholder="Enter your email address" />
    </div>
    <div className="mbsc-col-12 mbsc-col-md-6 mbsc-col-lg-3">
        <Input label="Password" inputStyle="box" labelStyle="floating" placeholder="Set a password" passwordToggle="true" />
    </div>
    <div className="mbsc-col-12 mbsc-col-lg-6">
        <Input label="Address" inputStyle="box" labelStyle="floating" placeholder="What is your address?" />
    </div>
</div>
<div className="mbsc-row">
    <div className="mbsc-col-12 mbsc-col-md-6 mbsc-col-lg-3">
        <Input label="Town" inputStyle="box" labelStyle="floating" placeholder="Enter your town" />
    </div>
    <div className="mbsc-col-12 mbsc-col-md-6 mbsc-col-lg-3">
        <Input label="State" inputStyle="box" labelStyle="floating" placeholder="Select your state" />
    </div>
    <div className="mbsc-col-12 mbsc-col-md-6 mbsc-col-lg-3">
        <Input label="Zip" inputStyle="box" labelStyle="floating" placeholder="What is your zip code" />
    </div>
    <div className="mbsc-col-12 mbsc-col-md-6 mbsc-col-lg-3">
        <Input label="Country" inputStyle="box" labelStyle="floating" placeholder="Select your country" />
    </div>
</div>
<div className="mbsc-row">
    <div className="mbsc-col-12 mbsc-col-md-12 mbsc-col-lg-3">
        <div className="mbsc-button-group-block">
            <Button color="success">Create account</Button>
        </div>
    </div>
</div>
       </div>
    
    </>
  )
}

export default Register
