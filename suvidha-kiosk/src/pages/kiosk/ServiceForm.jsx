import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useKioskStore } from "../../store/kioskStore";
import { useTranslation } from "react-i18next";

export default function ServiceForm() {
  const navigate = useNavigate();
  const { service, setFormData } = useKioskStore();
  const { t } = useTranslation();

  const fields = useMemo(() => service?.fields || [], [service]);

  const [data, setData] = useState(() => {
    const init = {};
    fields.forEach((f) => (init[f.key] = ""));
    return init;
  });

  if (!service) {
    return (
      <div className="page">
        <h1 className="title">No service selected</h1>
        <button className="btn btn-primary" onClick={() => navigate("/home")}>
          Go Home
        </button>
      </div>
    );
  }

  const update = (key, value) => setData((p) => ({ ...p, [key]: value }));

  const next = () => {
    for (const f of fields) {
      if (f.required && !data[f.key]) {
        alert(`${t("pleaseFill")} ${t(f.labelKey)}`);
        return;
      }
    }
    setFormData(data);
    navigate("/review");
  };

  return (
    <div className="page">
      <h1 className="title">{t("serviceFormTitle")}</h1>
      <p className="muted">
        {t("selectedService")}: <b>{t(service.labelKey)}</b>
      </p>

      <div className="panel">
        {fields.map((f) => (
          <div key={f.key} className="field">
            <label className="label">
              {t(f.labelKey)} {f.required ? <span className="req">*</span> : null}
            </label>

            {f.type === "textarea" ? (
              <textarea
                className="textarea"
                value={data[f.key]}
                onChange={(e) => update(f.key, e.target.value)}
                placeholder={t(f.placeholderKey)}
              />
            ) : (
              <input
                className="input"
                value={data[f.key]}
                onChange={(e) => update(f.key, e.target.value)}
                placeholder={t(f.placeholderKey)}
              />
            )}
          </div>
        ))}

        <button className="btn btn-primary" onClick={next}>
          {t("continue")}
        </button>
      </div>
    </div>
  );
}
