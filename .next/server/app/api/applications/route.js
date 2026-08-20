"use strict";(()=>{var e={};e.id=569,e.ids=[569],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8678:e=>{e.exports=import("pg")},5749:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.r(t),a.d(t,{originalPathname:()=>E,patchFetch:()=>l,requestAsyncStorage:()=>u,routeModule:()=>c,serverHooks:()=>m,staticGenerationAsyncStorage:()=>d});var o=a(9303),n=a(8716),s=a(670),i=a(2868),p=e([i]);i=(p.then?(await p)():p)[0];let c=new o.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/applications/route",pathname:"/api/applications",filename:"route",bundlePath:"app/api/applications/route"},resolvedPagePath:"E:\\Development\\LOANEXA WEB APP\\LOANEXA-WEB-APP\\app\\api\\applications\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:u,staticGenerationAsyncStorage:d,serverHooks:m}=c,E="/api/applications/route";function l(){return(0,s.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:d})}r()}catch(e){r(e)}})},2868:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.r(t),a.d(t,{GET:()=>i,POST:()=>p,dynamic:()=>l});var o=a(7070),n=a(9487),s=e([n]);n=(s.then?(await s)():s)[0];let l="force-dynamic";async function i(e){let t=e.nextUrl.searchParams.get("id");if(!t)return o.NextResponse.json({error:"Missing application token identifier"},{status:400});let a=t.trim().toUpperCase();try{let e=await (0,n.I)(`SELECT 
        a.id, 
        u.full_name AS "fullName", 
        a.status, 
        a.loan_amount AS "loanAmount", 
        a.loan_purpose AS "loanPurpose", 
        a.external_verify_link AS "externalVerifyLink", 
        a.created_at AS "createdAt"
       FROM applications a
       JOIN users u ON a.user_id = u.id
       WHERE a.id = $1`,[a]);if(0===e.rows.length)return o.NextResponse.json({error:"Token reference match not found"},{status:404});let t=e.rows[0];return o.NextResponse.json({...t,loanAmount:Number(t.loanAmount)})}catch(e){return console.error("Database application lookup error:",e),o.NextResponse.json({error:"Failed to retrieve application"},{status:500})}}async function p(e){try{let{fullName:t,dob:a,email:r,phone:s,streetAddress:i,city:p,state:l,zipCode:c,employmentStatus:u,employerName:d,annualIncome:m,loanPurpose:E,ssnLast4:A,dlState:h,driverLicenseNumber:y,loanAmount:N,loanTerm:_}=await e.json(),D=`LN-2026-${Math.floor(1e3+9e3*Math.random())}`,P=`https://verify.loanexa.com/session/${D}`,v=`
      INSERT INTO users (full_name, email, phone, dob, address, city, state, zip)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (email) DO UPDATE 
      SET full_name = EXCLUDED.full_name,
          phone = EXCLUDED.phone,
          address = EXCLUDED.address,
          city = EXCLUDED.city,
          state = EXCLUDED.state,
          zip = EXCLUDED.zip
      RETURNING id;
    `,$=[t||"Applicant",r||`applicant_${Date.now()}@loanexa.local`,s||"000-000-0000",a||"2000-01-01",i||"Not Provided",p||"Not Provided",l||"CA",c||"00000"],f=(await (0,n.I)(v,$)).rows[0].id,x=`
      INSERT INTO applications (
        id,
        user_id,
        income,
        employment_status,
        employer_name,
        loan_amount,
        loan_term_months,
        loan_purpose,
        ssn_last_4,
        license_number,
        license_state,
        external_verify_link,
        status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'pending'
      )
      RETURNING id;
    `,R=parseInt(_,10)||12,S=[D,f,m?parseFloat(m):0,u||"Full-Time",d||null,N?parseFloat(N):5e3,R,E||"Debt Consolidation",A||"0000",y||"NONE",h||l||"CA",P],w=await (0,n.I)(x,S);return o.NextResponse.json({id:w.rows[0].id,success:!0},{status:201})}catch(e){return console.error("Database insert error:",e),o.NextResponse.json({error:"Failed to record application in database",details:e.message},{status:500})}}r()}catch(e){r(e)}})},9487:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.d(t,{I:()=>s});var o=a(8678),n=e([o]);let i=new(o=(n.then?(await n)():n)[0]).Pool({connectionString:process.env.DATABASE_URL||process.env.POSTGRES_URL,user:process.env.PGUSER,host:process.env.PGHOST,database:process.env.PGDATABASE,password:process.env.PGPASSWORD,port:Number(process.env.PGPORT||5432),ssl:{rejectUnauthorized:!1}});async function s(e,t){let a=Date.now();try{let r=await i.query(e,t),o=Date.now()-a;return console.log("Executed query",{text:e,duration:o,rows:r.rowCount}),r}catch(e){throw console.error("Database query error layer:",e),e}}r()}catch(e){r(e)}})}};var t=require("../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),r=t.X(0,[276,972],()=>a(5749));module.exports=r})();