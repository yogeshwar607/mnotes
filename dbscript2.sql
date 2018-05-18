CREATE TABLE "Remittance".payees(
    payee_id uuid NOT NULL,
    cust_id uuid NOT NULL,
    alias character varying(100),
    email character varying(100) NOT NULL,
    pincode character varying(20),
    title character varying(10),
    first_name character varying(100),
    middle_name character varying(100),
    last_name character varying(100),
    full_name character varying(300),
    company_name character varying(100),
    is_active boolean DEFAULT true,
    is_company_payee boolean DEFAULT false,
    source character varying(10),
    state character varying(50),
    city character varying(50),
    mobile_number character varying(20),
    account_number character varying(50),
    bank_name character varying(100),
    bank_code character varying(50),
    account_type character varying(30),
    country_code character varying(5),
    relationship character varying(50),
    address character varying(200),
    routing_code_type_1 character varying(20),
    routing_code_value_1 character varying(20),
    routing_code_type_2 character varying(20),
    routing_code_value_2 character varying(20),
    routing_code_type_3 character varying(20),
    routing_code_value_3 character varying(20),
    modified_on timestamptz DEFAULT now(),
    modified_by uuid,
    created_on timestamptz,
    created_by uuid,

    CONSTRAINT payees_pkey PRIMARY KEY(payee_id)
)
WITH(
    OIDS = FALSE
);
ALTER TABLE "Remittance".payees
OWNER TO postgres;