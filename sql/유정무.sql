SELECT
 *
FROM
  user_dtl ud
LEFT OUTER JOIN user_quize uq ON (uq.quize_code = ud.quize_code)