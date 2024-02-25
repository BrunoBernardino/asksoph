SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


--
-- Name: asksoph_user_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asksoph_user_sessions (
    id uuid DEFAULT gen_random_uuid(),
    user_id uuid DEFAULT gen_random_uuid(),
    expires_at timestamp with time zone NOT NULL,
    last_seen_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.asksoph_user_sessions OWNER TO postgres;


--
-- Name: asksoph_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asksoph_users (
    id uuid DEFAULT gen_random_uuid(),
    email character varying NOT NULL,
    hashed_password text NOT NULL,
    subscription jsonb NOT NULL,
    status character varying NOT NULL,
    extra jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.asksoph_users OWNER TO postgres;


--
-- Name: asksoph_anonymous_ips; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asksoph_anonymous_ips (
    id uuid DEFAULT gen_random_uuid(),
    ip character varying NOT NULL,
    questions_available smallint NOT NULL DEFAULT 5,
    expires_at timestamp with time zone NOT NULL,
    last_seen_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.asksoph_anonymous_ips OWNER TO postgres;


--
-- Name: asksoph_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asksoph_migrations (
    id uuid DEFAULT gen_random_uuid(),
    name character varying(100) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.asksoph_migrations OWNER TO postgres;


--
-- Name: asksoph_user_sessions asksoph_user_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asksoph_user_sessions
    ADD CONSTRAINT asksoph_user_sessions_pkey PRIMARY KEY (id);
    

--
-- Name: asksoph_users asksoph_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asksoph_users
    ADD CONSTRAINT asksoph_users_pkey PRIMARY KEY (id);


--
-- Name: asksoph_anonymous_ips asksoph_anonymous_ips_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asksoph_anonymous_ips
    ADD CONSTRAINT asksoph_anonymous_ips_pkey PRIMARY KEY (id);
    

--
-- Name: asksoph_migrations asksoph_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asksoph_migrations
    ADD CONSTRAINT asksoph_migrations_pkey PRIMARY KEY (id);


--
-- Name: asksoph_user_sessions asksoph_user_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asksoph_user_sessions
    ADD CONSTRAINT asksoph_user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.asksoph_users(id);


--
-- Name: TABLE asksoph_user_sessions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.asksoph_user_sessions TO postgres;


--
-- Name: TABLE asksoph_users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.asksoph_users TO postgres;


--
-- Name: TABLE asksoph_anonymous_ips; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.asksoph_anonymous_ips TO postgres;


--
-- Name: TABLE asksoph_migrations; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.asksoph_migrations TO postgres;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO postgres;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO postgres;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO postgres;
