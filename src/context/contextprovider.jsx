import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { initFlowbite } from "flowbite";

const ContextProvider = createContext();
const WebContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [dnsdata, setDnsdata] = useState("None");
  useEffect(() => {
    initFlowbite();
    isAuth();
  }, []);
  const [loader, setloader] = useState(true);
  const URL = "https://lgbackend-sxqu.onrender.com/api/v1";
  const isAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        let response = await fetch(`${URL}/isAuth`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Including bearer token in the Authorization header
          },
        });
        response = await response.json();
        setloader(false);
        if (response.success === false) {
          navigate("/");
        } else {
          await FetchDNSDdata();
          navigate("/dashboard");
        }
      } else {
        setloader(false);
        navigate("/");
      }
    } catch (error) {
      setloader(false);
      navigate("/");
    }
  };
  const LoginAPI = async (email, password) => {
    try {
      let response = await fetch(`${URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });
      let data = await response.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        await FetchDNSDdata();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return true;
    }
  };
  const LogOutAPI = async () => {
    try {
      localStorage.clear();
      toast.success("Logged Out Successfully");
      navigate("/");
    } catch (error) {
      toast.error("Logged Out Failed");
    }
  };
  const FetchDNSDdata = async () => {
    try {
      const token = localStorage.getItem("token");
      let response = await fetch(`${URL}/getData`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      let data = await response.json();
      if (data.success) {
        toast.success("Fetched Data successfully");
        setDnsdata(data.data);
        return true;
      } else {
        toast.error("Error fetching data");
        return false;
      }
    } catch (error) {
      toast.error("Error fetching data");
      return true;
    }
  };
  const deleteRecord = async (
    hostedZoneId,
    recordName,
    recordType,
    recordValue,
    ttl
  ) => {
    try {
      const token = localStorage.getItem("token");
      let response = await fetch(`${URL}/handleDNS`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hostedZoneId: hostedZoneId,
          recordName: recordName,
          recordType: recordType,
          recordValue: recordValue,
          ttl: ttl,
        }),
      });
      let data = await response.json();
      if (data.success) {
        toast.success(data.message);
        await FetchDNSDdata();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("some error occurred");

      return true;
    }
  };
  const addRecord = async (
    hostedZoneId,
    recordName,
    recordType,
    recordValue,
    ttl
  ) => {
    try {
      const token = localStorage.getItem("token");
      let response = await fetch(`${URL}/handleDNS`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hostedZoneId: hostedZoneId,
          recordName: recordName,
          recordType: recordType,
          recordValue: recordValue,
          ttl: ttl,
        }),
      });
      let data = await response.json();
      if (data.success) {
        toast.success(data.message);
        await FetchDNSDdata();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("some error occurred");

      return true;
    }
  };
  const editRecord = async (
    hostedZoneId,
    recordName,
    recordType,
    recordValue,
    ttl
  ) => {
    try {
      const token = localStorage.getItem("token");
      let response = await fetch(`${URL}/handleDNS`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hostedZoneId: hostedZoneId,
          recordName: recordName,
          recordType: recordType,
          recordValue: recordValue,
          ttl: ttl,
        }),
      });
      let data = await response.json();
      if (data.success) {
        toast.success(data.message);
        await FetchDNSDdata();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("some error occurred");

      return true;
    }
  };
  const enablednssec = async (hostedZoneId) => {
    try {
      const token = localStorage.getItem("token");
      let response = await fetch(`${URL}/enableDNSSEC`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hostedZoneId: hostedZoneId,
        }),
      });
      let data = await response.json();
      if (data.success) {
        toast.success(data.message);
        await FetchDNSDdata();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("some error occurred");
    }
  };
  const disablednssec = async (hostedZoneId) => {
    try {
      const token = localStorage.getItem("token");
      let response = await fetch(`${URL}/disableDNSSEC`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hostedZoneId: hostedZoneId,
        }),
      });
      let data = await response.json();
      if (data.success) {
        toast.success(data.message);
        await FetchDNSDdata();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("some error occurred");
    }
  };

  return (
    <ContextProvider.Provider
      value={{
        LoginAPI,
        LogOutAPI,
        dnsdata,
        setDnsdata,
        deleteRecord,
        addRecord,
        editRecord,
        enablednssec,
        disablednssec,
        FetchDNSDdata,
        URL,
        loader,
      }}
    >
      {children}
    </ContextProvider.Provider>
  );
};

export default WebContextProvider;

export const useWebContext = () => {
  return useContext(ContextProvider);
};
