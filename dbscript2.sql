CREATE TABLE "Remittance".payees(
    payee_id character varying(100) NOT NULL,
    cust_id character varying(100) NOT NULL,
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
    modified_by character varying(100),
    created_on timestamptz,
    created_by character varying(100),

    CONSTRAINT payees_pkey PRIMARY KEY(payee_id)
)
WITH(
    OIDS = FALSE
);
ALTER TABLE "Remittance".payees
OWNER TO postgres;

CREATE TABLE "Remittance".otp_verification_failed_attempt(
    registration_id character varying(100) NOT NULL,
    mobile_number character varying(20),
    verification_failed_on timestamptz
)
WITH(
    OIDS = FALSE
);

ALTER TABLE "Remittance".otp_verification_failed_attempt
OWNER TO postgres;




-- Table: "Remittance".customer

-- DROP TABLE "Remittance".customer;

CREATE TABLE "Remittance".customer
(
    registration_id character varying(100) NOT NULL,
    email character varying(100) COLLATE pg_catalog."default" NOT NULL,
    password character varying(100) COLLATE pg_catalog."default" NOT NULL,
    source character varying(20) COLLATE pg_catalog."default",
    type character varying(20) COLLATE pg_catalog."default",
    is_email_verified boolean,
    email_verified_on timestamp(3) without time zone,
    is_otp_verified boolean DEFAULT false,
    otp_verified_on timestamp(3) with time zone,
    is_transfer_activated boolean DEFAULT false,
    transfer_activated_on timestamp(3) with time zone,
    is_account_blocked boolean DEFAULT false,
    is_transaction_blocked boolean DEFAULT false,
    last_logged_in timestamp(3) with time zone,
    created_on timestamp(3) with time zone,
    modified_on timestamp(3) with time zone,
    modified_by character varying(100) COLLATE pg_catalog."default",
    mobile_numer character varying(20) COLLATE pg_catalog."default",
    CONSTRAINT customer1_pkey PRIMARY KEY (registration_id),
    UNIQUE (email,mobile_number)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE "Remittance".customer
    OWNER to postgres;

COMMENT ON COLUMN "Remittance".customer.modified_on
    IS '
';

create table "Remittance".otp_verification
(
  cust_id                character varying(100) not null,
  mobile_number          varchar(20),
  verification_failed_on timestamp(3) with time zone,
  otp_secret             varchar(100),
  created_on             timestamp with time zone default now()
)WITH(
    OIDS = FALSE
);
ALTER TABLE "Remittance".otp_verification
OWNER TO postgres;

create table "Remittance".email_verification
(
  cust_id                character varying(100) not null,
  verification_failed_on timestamp(3) with time zone,
  email_secret           varchar(100),
  created_on             timestamp with time zone default now()
)WITH(
    OIDS = FALSE
);
ALTER TABLE "Remittance".email_verification
OWNER TO postgres;

create table "Remittance".transaction
(
  transaction_id                        character varying(100)         not null
    constraint transaction_pkey
    primary key,
  transaction_number                    varchar(100) not null,
  from_currency                         varchar(15)  not null,
  to_currency                           varchar(15)  not null,
  from_amount                           numeric(18, 2),
  to_amount                             numeric(18, 2),
  fx_rate_offered                       numeric(18, 2),
  fx_rate_actual                        numeric(18, 2),
  fx_rate_bank                          numeric(18, 2),
  fees                                  numeric(18, 2),
  bank_fees                             numeric(18, 2),
  discount                              numeric(18, 2),
  coupon_code                           varchar(15),
  bonus                                 numeric(18, 2),
  savings                               numeric(18, 2),
  is_referral_bonus                     boolean,
  referral_code                         varchar(15),
  source_of_fund                        varchar(30),
  source_of_fund_other_description      varchar(100),
  payee_id                              character varying(100),
  reason_for_transfer                   varchar(30),
  reason_for_transfer_other_description varchar(100),
  payment_mode                          varchar(15),
  transaction_created_on                timestamp with time zone,
  payment_estimated_date                timestamp with time zone,
  is_cancelled                          boolean,
  is_otp_verified                       boolean,
  status                                varchar(15),
  is_completed                          boolean,
  completed_on                          timestamp with time zone,
  cancelled_on                          timestamp with time zone,
  cancelled_by                          varchar(100),
  cust_id                               character varying(100)         not null,
  created_by                            character varying(100),
  modified_by                           character varying(100),
  created_on                            timestamp with time zone,
  modified_on                           timestamp with time zone
)WITH(
    OIDS = FALSE
);
ALTER TABLE "Remittance".transaction
OWNER TO postgres;



CREATE TABLE "Remittance".individual_customer_detail
(
  cust_id character varying(100) NOT NULL,
  country_of_residence character varying(20) NOT NULL,
  country_of_transaction character varying(20) NOT NULL,
  first_name character varying(50),
  middle_name character varying(50),
  last_name character varying(50),
  title character varying(20),
  dob date,
  address_line1 character varying(100),
  address_line2 character varying(100),
  postal_code character varying(20),
  state character varying(15),
  city character varying(25),
  nationality character varying(10),
  employment_status character varying(100),
  source_of_funds character varying(100),
  is_pep boolean DEFAULT false,
  intended_use_of_account character varying(100),
  net_worth character varying(50),
  type_of_industry character varying(100),
  is_dual_citizen boolean DEFAULT false,
  created_on timestamp(3) with time zone DEFAULT now(),
  modified_on timestamp(3) with time zone DEFAULT now(),
  modified_by character varying(100),
  CONSTRAINT cust1_pkey PRIMARY KEY (cust_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "Remittance".individual_customer_detail
  OWNER TO postgres;


  CREATE TABLE "Remittance".individual_doc_detail
(
  doc_id serial PRIMARY KEY ,
  cust_id character varying(100) NOT NULL,
  transaction_id character varying(100),
  doc_type character varying(20),
  doc_path character varying(100),
  is_deleted boolean DEFAULT false,
  deleted_on timestamp(3) with time zone,
  deleted_by character varying(100),
  is_verified boolean DEFAULT false,
  verified_on timestamp(3) with time zone,
  verified_by character varying(100),
  uploaded_on timestamp(3) with time zone,
  uploaded_by character varying(100),
  comment text array,
  doc_detail json
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "Remittance".individual_doc_detail
  OWNER TO postgres;