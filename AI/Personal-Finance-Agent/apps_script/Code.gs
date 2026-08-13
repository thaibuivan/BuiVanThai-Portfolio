const APP = {
  transactionsSheet: "Transactions",
  dashboardSheet: "Dashboard",
  reportSheet: "Report",
  monthlySheet: "Monthly Summary",
  debtSheet: "Debt Summary",
  rulesSheet: "Rules",
  maxThreadsPerPoll: 20,
  geminiModel: "models/gemini-2.0-flash",
  defaultGmailQuery:
    'newer_than:2d ("Thong bao giao dich thanh cong" OR "Thông báo giao dịch thành công" OR mbbank OR mbebanking)',
};

const TRANSACTION_HEADERS = [
  "transaction_id",
  "bank",
  "occurred_at",
  "month",
  "transaction_type",
  "amount",
  "category",
  "review_status",
  "include_in_spending",
  "cashflow_type",
  "counterparty",
  "content",
  "debt_person",
  "principal_amount",
  "interest_amount",
  "telegram_message_id",
  "email_id",
  "raw_subject",
  "raw_from",
  "raw_snippet",
  "personal_amount",
  "shared_with_count",
  "reimbursable_amount",
  "split_note",
];

const MONTHLY_HEADERS = [
  "month",
  "income",
  "expense",
  "net_living_cashflow",
  "loan_received",
  "loan_principal_paid",
  "loan_given",
  "loan_collected",
  "interest_or_fee",
  "needs_review_count",
];

const DEBT_HEADERS = [
  "person",
  "borrowed_from_others",
  "principal_repaid",
  "lent_to_others",
  "collected_from_others",
  "net_you_owe",
  "net_others_owe_you",
];

const RULE_HEADERS = ["keyword", "category", "include_in_spending", "cashflow_type"];

const CATEGORY_RULES = [
  ["trano", "Trả nợ gốc", false, "loan_repayment"],
  ["tra no", "Trả nợ gốc", false, "loan_repayment"],
  ["trả nợ", "Trả nợ gốc", false, "loan_repayment"],
  ["tragoc", "Trả nợ gốc", false, "loan_repayment"],
  ["tra goc", "Trả nợ gốc", false, "loan_repayment"],
  ["trả gốc", "Trả nợ gốc", false, "loan_repayment"],
  ["chovay", "Cho vay", false, "loan_out"],
  ["cho vay", "Cho vay", false, "loan_out"],
  ["thuhoino", "Thu hồi cho vay", false, "loan_collection"],
  ["thu hoi no", "Thu hồi cho vay", false, "loan_collection"],
  ["thu hồi nợ", "Thu hồi cho vay", false, "loan_collection"],
  ["hoanvay", "Thu hồi cho vay", false, "loan_collection"],
  ["hoan vay", "Thu hồi cho vay", false, "loan_collection"],
  ["hoantien", "Hoàn tiền chia bill", false, "reimbursement"],
  ["hoan tien", "Hoàn tiền chia bill", false, "reimbursement"],
  ["hoàn tiền", "Hoàn tiền chia bill", false, "reimbursement"],
  ["chiabill", "Hoàn tiền chia bill", false, "reimbursement"],
  ["chia bill", "Hoàn tiền chia bill", false, "reimbursement"],
  ["vaytien", "Vay nhận vào", false, "loan_in"],
  ["vay tien", "Vay nhận vào", false, "loan_in"],
  ["vay", "Vay nhận vào", false, "loan_in"],
  ["muon", "Vay nhận vào", false, "loan_in"],
  ["mượn", "Vay nhận vào", false, "loan_in"],
  ["laivay", "Chi phí tài chính", true, "financial_cost"],
  ["lai vay", "Chi phí tài chính", true, "financial_cost"],
  ["lãi vay", "Chi phí tài chính", true, "financial_cost"],
  ["phivay", "Chi phí tài chính", true, "financial_cost"],
  ["phi vay", "Chi phí tài chính", true, "financial_cost"],
  ["luong", "Thu nhập", false, "income"],
  ["lương", "Thu nhập", false, "income"],
  ["salary", "Thu nhập", false, "income"],
  ["thu nhap", "Thu nhập", false, "income"],
  ["thu nhập", "Thu nhập", false, "income"],
  ["thuong", "Thu nhập", false, "income"],
  ["thưởng", "Thu nhập", false, "income"],
  ["anuong", "Ăn uống", true, "spending"],
  ["an uong", "Ăn uống", true, "spending"],
  ["ăn uống", "Ăn uống", true, "spending"],
  ["food", "Ăn uống", true, "spending"],
  ["cafe", "Ăn uống", true, "spending"],
  ["coffee", "Ăn uống", true, "spending"],
  ["sieuthi", "Siêu thị", true, "spending"],
  ["sieu thi", "Siêu thị", true, "spending"],
  ["siêu thị", "Siêu thị", true, "spending"],
  ["winmart", "Siêu thị", true, "spending"],
  ["24 hours mart", "Siêu thị", true, "spending"],
  ["muasam", "Mua sắm", true, "spending"],
  ["mua sam", "Mua sắm", true, "spending"],
  ["mua sắm", "Mua sắm", true, "spending"],
  ["shopee", "Mua sắm", true, "spending"],
  ["lazada", "Mua sắm", true, "spending"],
  ["dichuyen", "Di chuyển", true, "spending"],
  ["di chuyen", "Di chuyển", true, "spending"],
  ["di chuyển", "Di chuyển", true, "spending"],
  ["grab", "Di chuyển", true, "spending"],
  ["taxi", "Di chuyển", true, "spending"],
  ["xang", "Di chuyển", true, "spending"],
  ["xăng", "Di chuyển", true, "spending"],
  ["giadinh", "Gia đình", true, "spending"],
  ["gia dinh", "Gia đình", true, "spending"],
  ["gia đình", "Gia đình", true, "spending"],
  ["nhatro", "Nhà cửa", true, "spending"],
  ["nha tro", "Nhà cửa", true, "spending"],
  ["nhà trọ", "Nhà cửa", true, "spending"],
  ["hocphi", "Học tập", true, "spending"],
  ["hoc phi", "Học tập", true, "spending"],
  ["học phí", "Học tập", true, "spending"],
  ["suckhoe", "Sức khỏe", true, "spending"],
  ["suc khoe", "Sức khỏe", true, "spending"],
  ["sức khỏe", "Sức khỏe", true, "spending"],
  ["giaitri", "Giải trí", true, "spending"],
  ["giai tri", "Giải trí", true, "spending"],
  ["giải trí", "Giải trí", true, "spending"],
  ["noibo", "Chuyển khoản nội bộ", false, "internal_transfer"],
  ["noi bo", "Chuyển khoản nội bộ", false, "internal_transfer"],
  ["nội bộ", "Chuyển khoản nội bộ", false, "internal_transfer"],
  ["tietkiem", "Tiết kiệm", false, "saving"],
  ["tiet kiem", "Tiết kiệm", false, "saving"],
  ["tiết kiệm", "Tiết kiệm", false, "saving"],
  ["dautu", "Đầu tư", false, "investment"],
  ["dau tu", "Đầu tư", false, "investment"],
  ["đầu tư", "Đầu tư", false, "investment"],
];

const TELEGRAM_CATEGORIES = [
  ["Ăn uống", "spending", true],
  ["Siêu thị", "spending", true],
  ["Mua sắm", "spending", true],
  ["Di chuyển", "spending", true],
  ["Gia đình", "spending", true],
  ["Nhà cửa", "spending", true],
  ["Học tập", "spending", true],
  ["Sức khỏe", "spending", true],
  ["Giải trí", "spending", true],
  ["Vay nhận vào", "loan_in", false],
  ["Trả nợ gốc", "loan_repayment", false],
  ["Cho vay", "loan_out", false],
  ["Thu hồi cho vay", "loan_collection", false],
  ["Hoàn tiền chia bill", "reimbursement", false],
  ["Chi phí tài chính", "financial_cost", true],
  ["Chuyển khoản nội bộ", "internal_transfer", false],
];

function setupFinanceAgent() {
  const ss = SpreadsheetApp.getActive();
  setupSheets_(ss);
  installMinuteTrigger_();
  SpreadsheetApp.flush();
}

function pollFinanceAgent() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(2000)) {
    return;
  }

  try {
    const ss = SpreadsheetApp.getActive();
    setupSheets_(ss);
    syncTelegramReviews_();
    pollGmail_();
    refreshSummaries_();
  } finally {
    lock.releaseLock();
  }
}

function syncTelegramReviews() {
  syncTelegramReviews_();
  refreshSummaries_();
}

function refreshDashboardNow() {
  refreshSummaries_();
  forceRebuildDashboard_(SpreadsheetApp.getActive());
}

function forceRebuildDashboard() {
  const ss = SpreadsheetApp.getActive();
  forceRebuildDashboard_(ss);
}

function sendDashboardChartsNow() {
  sendDashboardCharts_("/chart");
}

function testGeminiIntent() {
  const intent = parseFinanceIntentWithGemini_("report tháng 6");
  const error = property_("GEMINI_LAST_ERROR");
  sendTelegramMessage_(intent ? JSON.stringify(intent) : `Không gọi được Gemini.\n${error || "Chưa có lỗi chi tiết."}`);
}

function repairAndRefreshDashboard() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(APP.transactionsSheet);
  if (!sheet) {
    setupSheets_(ss);
    refreshSummaries_();
    return;
  }

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    refreshSummaries_();
    return;
  }

  const headers = values[0];
  const col = columns_(headers);
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (!row.some((cell) => cell !== "" && cell !== null)) {
      continue;
    }

    if (col.transaction_id !== undefined && !row[col.transaction_id]) {
      const seed = [
        row[col.email_id] || "",
        row[col.occurred_at] || "",
        row[col.amount] || "",
        row[col.content] || "",
        i,
      ].join(":");
      sheet.getRange(i + 1, col.transaction_id + 1).setValue(digest_(seed).slice(0, 24));
    }

    if (col.month !== undefined && !row[col.month] && col.occurred_at !== undefined) {
      sheet.getRange(i + 1, col.month + 1).setValue(monthKeyFromRow_(rowToObject_(row, headers)));
    }
  }

  refreshSummaries_();
}

function resetTelegramSync() {
  PropertiesService.getScriptProperties().deleteProperty("TELEGRAM_OFFSET");
  syncTelegramReviews_();
  refreshSummaries_();
}

function pollGmailNow() {
  pollGmail_();
  refreshSummaries_();
}

function backfillCurrentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 1);
  const query =
    `after:${formatGmailDate_(start)} before:${formatGmailDate_(end)} ` +
    '("Thong bao giao dich thanh cong" OR "Thông báo giao dịch thành công" OR mbbank OR mbebanking)';
  const result = pollGmailWithQuery_(query, 300, { notify: false });
  refreshSummaries_();
  sendTelegramMessage_(
    [
      "Đã quét dữ liệu tháng hiện tại.",
      `Giao dịch mới thêm: ${result.inserted}`,
      `Cần phân loại: ${result.needsReview}`,
      "",
      "Mình không gửi từng câu hỏi Telegram cho dữ liệu cũ để tránh spam. Bạn có thể phân loại dần trong Google Sheet.",
    ].join("\n")
  );
}

function testTelegram() {
  sendTelegramMessage_("Finance Agent đã kết nối Telegram thành công.");
}

function diagnoseFinanceAgent() {
  const ss = SpreadsheetApp.getActive();
  setupSheets_(ss);
  const sheet = ss.getSheetByName(APP.transactionsSheet);
  const rows = objectsFromSheet_(sheet);
  const currentMonth = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM");
  const monthRows = rows.filter((row) => String(row.month || "") === currentMonth);
  const headers = sheet.getLastColumn()
    ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].filter(Boolean).join(", ")
    : "";
  const query = property_("GMAIL_QUERY") || APP.defaultGmailQuery;
  const currentMonthQuery =
    `after:${formatGmailDate_(new Date(new Date().getFullYear(), new Date().getMonth(), 1))} ` +
    `before:${formatGmailDate_(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1))} ` +
    '("Thong bao giao dich thanh cong" OR "Thông báo giao dịch thành công" OR mbbank OR mbebanking)';
  const recentThreads = GmailApp.search(query, 0, 10).length;
  const monthThreads = GmailApp.search(currentMonthQuery, 0, 10).length;
  const broadMonthThreads = GmailApp.search(
    `after:${formatGmailDate_(new Date(new Date().getFullYear(), new Date().getMonth(), 1))} ` +
      `before:${formatGmailDate_(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1))} ` +
      "(mbbank OR mbebanking OR from:mbbank.com.vn)",
    0,
    10
  ).length;

  const message = [
    "Finance Agent diagnostic",
    `Transactions rows: ${rows.length}`,
    `Rows in ${currentMonth}: ${monthRows.length}`,
    `Recent Gmail threads matched: ${recentThreads}`,
    `Current-month Gmail threads matched: ${monthThreads}`,
    `Broad MB month threads matched: ${broadMonthThreads}`,
    `GMAIL_QUERY: ${query}`,
    `Headers: ${headers}`,
  ].join("\n");

  Logger.log(message);
  writeDiagnosticSheet_(ss, message);
  sendTelegramMessage_(message);
}

function resetFinanceAgentTrigger() {
  deleteTriggers_("pollFinanceAgent");
  installMinuteTrigger_();
}

function setupSheets_(ss) {
  const transactions = getOrCreateSheet_(ss, APP.transactionsSheet, TRANSACTION_HEADERS);
  const monthly = getOrCreateSheet_(ss, APP.monthlySheet, MONTHLY_HEADERS);
  const debt = getOrCreateSheet_(ss, APP.debtSheet, DEBT_HEADERS);
  const rules = getOrCreateSheet_(ss, APP.rulesSheet, RULE_HEADERS);

  formatSheet_(transactions);
  formatSheet_(monthly);
  formatSheet_(debt);
  formatSheet_(rules);

  if (rules.getLastRow() < 2) {
    rules
      .getRange(2, 1, CATEGORY_RULES.length, RULE_HEADERS.length)
      .setValues(CATEGORY_RULES);
  }

  transactions.hideColumns(1);
  transactions.hideColumns(16, 5);
  transactions.setFrozenRows(1);
}

function installMinuteTrigger_() {
  const exists = ScriptApp.getProjectTriggers().some(
    (trigger) => trigger.getHandlerFunction() === "pollFinanceAgent"
  );
  if (!exists) {
    ScriptApp.newTrigger("pollFinanceAgent").timeBased().everyMinutes(1).create();
  }
}

function deleteTriggers_(handlerName) {
  ScriptApp.getProjectTriggers().forEach((trigger) => {
    if (trigger.getHandlerFunction() === handlerName) {
      ScriptApp.deleteTrigger(trigger);
    }
  });
}

function pollGmail_() {
  const query = property_("GMAIL_QUERY") || APP.defaultGmailQuery;
  pollGmailWithQuery_(query, APP.maxThreadsPerPoll, { notify: true });
}

function pollGmailWithQuery_(query, maxThreads, options) {
  const settings = options || {};
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(APP.transactionsSheet);
  const existingEmailIds = existingValues_(sheet, "email_id");
  const threads = GmailApp.search(query, 0, maxThreads || APP.maxThreadsPerPoll);
  const rows = [];

  threads.forEach((thread) => {
    thread.getMessages().forEach((message) => {
      const emailId = message.getId();
      if (existingEmailIds[emailId]) {
        return;
      }

      const record = {
        emailId,
        subject: message.getSubject() || "",
        from: message.getFrom() || "",
        date: message.getDate(),
        body: message.getPlainBody() || stripHtml_(message.getBody() || ""),
      };
      const transaction = parseTransaction_(record);
      if (!transaction) {
        return;
      }

      rows.push(transactionToRow_(transaction));
      existingEmailIds[emailId] = true;
    });
  });

  if (rows.length) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, TRANSACTION_HEADERS.length).setValues(rows);
    if (settings.notify) {
      rows.forEach((row) => maybeAskTelegram_(rowToObject_(row)));
    }
  }

  return {
    inserted: rows.length,
    needsReview: rows.filter((row) => rowToObject_(row).review_status === "needs_review").length,
  };
}

function parseTransaction_(record) {
  const text = `${record.subject}\n${record.body}`;
  if (!looksLikeFinancialNotice_(record, text)) {
    return null;
  }

  const amount = extractAmount_(text);
  if (!amount) {
    return null;
  }

  const occurredAt = extractDate_(text) || record.date || new Date();
  const bank = detectBank_(record.from, record.subject);
  const content =
    labeledField_(text, ["Nội dung chuyển tiền", "Nội dung", "Remark", "Description"]) ||
    bestContentLine_(record.body);
  const rawReceiver =
    labeledField_(text, ["Người thụ hưởng", "Người nhận", "Bên thụ hưởng", "Tài khoản ghi có"]) || "";
  const rawSender = labeledField_(text, ["Tài khoản trích nợ", "Người gửi"]) || "";
  const transactionType = detectType_(text, amount);
  const counterparty = transactionType === "income" ? rawSender || rawReceiver : rawReceiver || rawSender;
  const category = categorize_(content, transactionType);
  const id = digest_(`${record.emailId}:${amount}:${occurredAt.toISOString()}:${content}`).slice(0, 24);

  return {
    transaction_id: id,
    bank,
    occurred_at: occurredAt,
    month: Utilities.formatDate(occurredAt, Session.getScriptTimeZone(), "yyyy-MM"),
    transaction_type: transactionType,
    amount: Math.abs(amount),
    category: category.category,
    review_status: category.needsReview ? "needs_review" : "confirmed",
    include_in_spending: category.includeInSpending,
    cashflow_type: category.cashflowType,
    counterparty: trim_(maskSensitive_(counterparty), 120),
    content: trim_(content, 160),
    debt_person: debtPersonFor_(category.cashflowType, counterparty),
    principal_amount: principalFor_(category.cashflowType, Math.abs(amount)),
    interest_amount: 0,
    telegram_message_id: "",
    email_id: record.emailId,
    raw_subject: trim_(record.subject, 160),
    raw_from: trim_(record.from, 160),
    raw_snippet: trim_(maskSensitive_(record.body.replace(/\s+/g, " ")), 500),
  };
}

function categorize_(content, transactionType) {
  const normalizedContent = normalize_(content);
  for (const [keyword, category, includeInSpending, cashflowType] of CATEGORY_RULES) {
    if (normalizedContent.includes(normalize_(keyword))) {
      return { category, includeInSpending, cashflowType, needsReview: false };
    }
  }

  return {
    category: "Cần phân loại",
    includeInSpending: false,
    cashflowType: "needs_review",
    needsReview: true,
  };
}

function syncTelegramReviews_() {
  const token = property_("TELEGRAM_BOT_TOKEN");
  const chatId = property_("TELEGRAM_CHAT_ID");
  if (!token || !chatId) {
    return;
  }

  const offset = Number(property_("TELEGRAM_OFFSET") || "0");
  const response = UrlFetchApp.fetch(telegramUrl_("getUpdates") + `?timeout=1&offset=${offset}`, {
    muteHttpExceptions: true,
  });
  const payload = JSON.parse(response.getContentText() || "{}");
  if (!payload.ok || !payload.result) {
    return;
  }

  let nextOffset = offset;
  payload.result.forEach((update) => {
    nextOffset = Math.max(nextOffset, update.update_id + 1);
    if (!update.callback_query || !update.callback_query.data) {
      if (update.message && update.message.text) {
        handleTelegramMessage_(update.message);
      }
      return;
    }

    const callback = update.callback_query;
    const parts = callback.data.split("|");
    if (parts[0] !== "cat" || parts.length !== 3) {
      return;
    }

    const transactionId = parts[1];
    const categoryIndex = Number(parts[2]);
    const selected = TELEGRAM_CATEGORIES[categoryIndex];
    if (!selected) {
      return;
    }

    const updated = updateTransactionCategory_(transactionId, selected[0], selected[1], selected[2]);
    answerCallback_(callback.id, updated ? "Đã cập nhật category." : "Không tìm thấy giao dịch.");
    if (updated && callback.message) {
      editTelegramMessage_(
        callback.message.chat.id,
        callback.message.message_id,
        `${callback.message.text}\n\nĐã chọn: ${selected[0]}`
      );
    }
  });

  setProperty_("TELEGRAM_OFFSET", String(nextOffset));
}

function handleTelegramMessage_(message) {
  const configuredChatId = String(property_("TELEGRAM_CHAT_ID") || "");
  if (configuredChatId && String(message.chat.id) !== configuredChatId) {
    return;
  }

  const text = String(message.text || "").trim();
  const command = text.split(/\s+/)[0].replace(/@.+$/, "").toLowerCase();
  if (!command.startsWith("/")) {
    handleNaturalLanguageMessage_(text);
    return;
  }

  if (command === "/dashboard" || command === "/summary") {
    sendTelegramMessage_(buildDashboardReply_(text));
    if (command === "/dashboard") {
      sendDashboardCharts_(text);
    }
    return;
  }
  if (command === "/chart" || command === "/charts" || command === "/dashboard_chart") {
    sendDashboardCharts_(text);
    return;
  }
  if (command === "/report") {
    sendTelegramMessage_(buildReportReplyWithInsight_(text));
    return;
  }
  if (command === "/debt") {
    sendTelegramMessage_(buildDebtReply_());
    return;
  }
  if (command === "/top") {
    sendTelegramMessage_(buildTopReply_(text));
    return;
  }
  if (command === "/split" || command === "/share") {
    sendTelegramMessage_(splitExpenseReply_(text));
    return;
  }
  if (command === "/uncategorized" || command === "/review") {
    sendTelegramMessage_(buildUncategorizedReply_());
    return;
  }
  if (command === "/help" || command === "/start") {
    sendTelegramMessage_(financeHelpText_());
    return;
  }
  if (command === "/help" || command === "/start") {
    sendTelegramMessage_(
      [
        "Các lệnh Finance Agent:",
        "/dashboard - Tổng quan tháng này",
        "/report - Báo cáo chữ cuối tháng",
        "/top - Top category và nơi nhận tiền",
        "/debt - Tình hình vay/nợ",
        "/uncategorized - Giao dịch cần phân loại",
        "",
        "Bạn cũng có thể dùng: /dashboard 2026-07 hoặc /top 2026-07",
      ].join("\n")
    );
  }
}

function financeHelpText_() {
  return [
    "Các lệnh Finance Agent:",
    "/dashboard - Tổng quan kèm biểu đồ",
    "/chart - Chỉ gửi biểu đồ dashboard",
    "/summary - Chỉ gửi số liệu tổng quan",
    "/report - Báo cáo chữ cuối tháng",
    "/top - Top category và nơi nhận tiền",
    "/debt - Tình hình vay/nợ",
    "/split latest 2 - Chia giao dịch gần nhất cho 2 người",
    "/split 120000 3 - Chia giao dịch gần nhất có số tiền 120.000 cho 3 người",
    "/uncategorized - Giao dịch cần phân loại",
    "",
    "Mặc định là tháng hiện tại.",
    "Ví dụ: /dashboard 2026-07 hoặc /chart latest",
    "",
    "Có thể hỏi tự nhiên: report tháng 6, ăn uống tháng này bao nhiêu, tôi còn nợ ai.",
  ].join("\n");
}

function handleNaturalLanguageMessage_(text) {
  if (isContinuationRequest_(text)) {
    const previous = loadLastNaturalIntent_();
    if (previous) {
      executeNaturalLanguageIntent_(previous.intent, previous.rawText);
      return;
    }
  }

  const intent = parseFinanceIntent_(text);
  if (!intent || !intent.intent || intent.intent === "unknown") {
    sendTelegramMessage_(buildGuardedGeneralReply_(text, intent));
    return;
  }
  if (!intent || !intent.intent || intent.intent === "unknown") {
    sendTelegramMessage_(
      [
        "Mình chưa hiểu câu này.",
        "Bạn có thể hỏi: report tháng 6, gửi biểu đồ tháng 7, ăn uống tháng này bao nhiêu, top chi tiêu tháng trước, tôi còn nợ ai.",
        `Đã thử hiểu bằng: ${intent && intent.source ? intent.source : "rule/Gemini"}`,
        "Hoặc dùng /help để xem lệnh tắt.",
      ].join("\n")
    );
    return;
  }
  executeNaturalLanguageIntent_(intent, text);
}

function isContinuationRequest_(text) {
  return /\b(tiep di|tiếp đi|tra loi tiep|trả lời tiếp|noi tiep|nói tiếp|continue)\b/i.test(normalize_(text));
}

function rememberNaturalIntent_(intent, rawText, commandText) {
  setProperty_(
    "LAST_NATURAL_INTENT",
    JSON.stringify({
      intent,
      rawText,
      commandText,
      savedAt: new Date().toISOString(),
    })
  );
}

function loadLastNaturalIntent_() {
  const raw = property_("LAST_NATURAL_INTENT");
  if (!raw) {
    return null;
  }
  try {
    const value = JSON.parse(raw);
    if (!value || !value.intent || !value.rawText) {
      return null;
    }
    return value;
  } catch (error) {
    return null;
  }
}

function parseFinanceIntent_(text) {
  const localIntent = parseFinanceIntentLocally_(text);
  if (localIntent && localIntent.intent !== "unknown") {
    localIntent.source = "rule";
    return localIntent;
  }

  const geminiIntent = parseFinanceIntentWithGemini_(text);
  if (geminiIntent) {
    return geminiIntent;
  }
  if (localIntent) {
    localIntent.source = "rule";
    return localIntent;
  }
  return { intent: "unknown", source: "none" };
}

function parseFinanceIntentLocally_(text) {
  const normalized = normalize_(text);
  const month = requestedMonthFromText_(text) || (wantsLatestMonth_(text) ? "latest" : "");
  const category = categoryFromText_(text);

  if (/(help|tro giup|huong dan|lenh)/i.test(normalized)) {
    return { intent: "help", month, category: "" };
  }
  if (/(chua phan loai|can phan loai|review|uncategorized)/i.test(normalized)) {
    return { intent: "uncategorized", month, category: "" };
  }
  if (/(no ai|vay no|con no|debt|tra no|cho vay|vay)/i.test(normalized)) {
    return { intent: "debt", month, category: "" };
  }
  if (/(bieu do|chart|dashboard chart|ve bieu do)/i.test(normalized)) {
    return { intent: "chart", month, category: "" };
  }
  if (/(bao cao|report)/i.test(normalized)) {
    return { intent: "report", month, category: "" };
  }
  if (/(top|nhieu nhat|lon nhat|cao nhat)/i.test(normalized)) {
    return { intent: "top", month, category: "" };
  }
  if (category && /(bao nhieu|het bao nhieu|tieu|chi|tong)/i.test(normalized)) {
    return { intent: "category_spend", month, category };
  }
  if (isGeneralSpendingQuestion_(normalized)) {
    return { intent: "dashboard", month, category: "" };
  }
  if (/(tong quan|dashboard|thang nay|thang truoc|tieu bao nhieu|chi bao nhieu|dong tien)/i.test(normalized)) {
    return { intent: "dashboard", month, category: "" };
  }
  return { intent: "unknown", month, category: "" };
}

function isGeneralSpendingQuestion_(normalized) {
  const hasSpendingWord = /(chi tieu|tong chi|tieu xai|tieu tien|da tieu|toi tieu|chi cua toi|tieu cua toi)/i.test(normalized);
  const hasAskWord = /(toi muon|muon xem|xem|cho toi xem|cho minh xem|cho biet|tong ket|thong ke|the nao|ra sao|bao nhieu)/i.test(normalized);
  const hasTimeWord = /(thang|hom nay|tu ngay|nam nay|latest|gan nhat|moi nhat)/i.test(normalized);
  return hasSpendingWord && (hasAskWord || hasTimeWord);
}

function parseFinanceIntentWithGemini_(text) {
  const apiKey = property_("GEMINI_API_KEY");
  if (!apiKey) {
    setProperty_("GEMINI_LAST_ERROR", "Thiếu Script Property GEMINI_API_KEY.");
    return null;
  }

  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");
  const prompt = [
    "You parse Vietnamese personal finance chatbot requests.",
    "Return JSON only, no markdown.",
    "Do not answer the finance question.",
    "Allowed intents: dashboard, chart, summary, report, top, debt, uncategorized, category_spend, about_bot, help, unknown.",
    "Allowed month values: YYYY-MM, current, previous, latest, or empty string.",
    "Allowed categories: An uong, Sieu thi, Mua sam, Di chuyen, Gia dinh, Nha cua, Hoc tap, Suc khoe, Giai tri, Vay nhan vao, Tra no goc, Cho vay, Thu hoi cho vay, Chi phi tai chinh, Chuyen khoan noi bo.",
    "Map general spending questions such as 'toi muon xem chi tieu cua toi trong thang 8' to dashboard.",
    "Map 'chi tieu thang 8', 'thang 8 toi tieu bao nhieu', or 'tong chi thang 8' to dashboard.",
    `Today: ${today}.`,
    'JSON shape: {"intent":"report","month":"2026-06","category":""}',
    'If the user asks who you are or what you can do, use {"intent":"about_bot","month":"","category":""}.',
    `User text: ${text}`,
  ].join("\n");

  setProperty_("GEMINI_LAST_ERROR", "");
  const models = geminiModelCandidates_();
  for (let i = 0; i < models.length; i++) {
    const result = callGeminiIntentModel_(models[i], apiKey, prompt);
    if (result.intent) {
      return result.intent;
    }
    if (result.error) {
      setProperty_("GEMINI_LAST_ERROR", result.error);
    }
  }
  return null;
}

function geminiModelCandidates_() {
  const configured = property_("GEMINI_MODEL");
  const candidates = [
    configured,
    APP.geminiModel,
    "models/gemini-2.5-flash",
    "models/gemini-2.5-flash-lite",
    "models/gemini-2.0-flash",
    "models/gemini-1.5-flash",
  ].filter(Boolean);
  return candidates.filter((model, index) => candidates.indexOf(model) === index);
}

function callGeminiIntentModel_(model, apiKey, prompt) {
  try {
    const response = UrlFetchApp.fetch(
      `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0,
            maxOutputTokens: 256,
            responseMimeType: "application/json",
          },
        }),
        muteHttpExceptions: true,
      }
    );
    const code = response.getResponseCode();
    const body = response.getContentText() || "{}";
    const payload = JSON.parse(body);
    if (code < 200 || code >= 300) {
      return { intent: null, error: `Model ${model} lỗi HTTP ${code}: ${geminiErrorMessage_(payload) || body.slice(0, 400)}` };
    }

    const output = geminiTextFromResponse_(payload);
    const intent = normalizeFinanceIntent_(parseJsonObject_(output));
    if (!intent || intent.intent === "unknown") {
      return { intent: null, error: `Model ${model} không trả JSON intent hợp lệ: ${String(output || body).slice(0, 400)}` };
    }
    intent.model = model;
    return { intent, error: "" };
  } catch (error) {
    return { intent: null, error: `Model ${model} exception: ${error && error.message ? error.message : error}` };
  }
}

function geminiErrorMessage_(payload) {
  return payload && payload.error && payload.error.message ? payload.error.message : "";
}

function generateGeminiText_(prompt, maxOutputTokens) {
  const apiKey = property_("GEMINI_API_KEY");
  if (!apiKey) {
    return "";
  }

  const models = geminiModelCandidates_();
  for (let i = 0; i < models.length; i++) {
    const result = callGeminiTextModel_(models[i], apiKey, prompt, maxOutputTokens || 420);
    if (result.text) {
      return result.text;
    }
    if (result.error) {
      setProperty_("GEMINI_LAST_ERROR", result.error);
    }
  }
  return "";
}

function callGeminiTextModel_(model, apiKey, prompt, maxOutputTokens) {
  try {
    const response = UrlFetchApp.fetch(
      `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.35,
            maxOutputTokens: maxOutputTokens,
          },
        }),
        muteHttpExceptions: true,
      }
    );
    const code = response.getResponseCode();
    const body = response.getContentText() || "{}";
    const payload = JSON.parse(body);
    if (code < 200 || code >= 300) {
      return { text: "", error: `Model ${model} insight lỗi HTTP ${code}: ${geminiErrorMessage_(payload) || body.slice(0, 400)}` };
    }
    return { text: geminiTextFromResponse_(payload).trim(), error: "" };
  } catch (error) {
    return { text: "", error: `Model ${model} insight exception: ${error && error.message ? error.message : error}` };
  }
}

function geminiTextFromResponse_(payload) {
  const candidate = payload && payload.candidates && payload.candidates[0];
  const parts = candidate && candidate.content && candidate.content.parts;
  if (!parts || !parts.length) {
    return "";
  }
  return parts.map((part) => part.text || "").join("\n");
}

function parseJsonObject_(text) {
  const raw = String(text || "").trim();
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) {
      return null;
    }
    try {
      return JSON.parse(match[0]);
    } catch (nestedError) {
      return null;
    }
  }
}

function normalizeFinanceIntent_(intent) {
  if (!intent || typeof intent !== "object") {
    return null;
  }

  const allowed = {
    dashboard: true,
    chart: true,
    summary: true,
    report: true,
    top: true,
    debt: true,
    uncategorized: true,
    category_spend: true,
    about_bot: true,
    help: true,
    unknown: true,
  };
  const normalizedIntent = String(intent.intent || "unknown").toLowerCase();
  const month = normalizeIntentMonth_(intent.month);
  const category = categoryFromText_(intent.category || "") || String(intent.category || "");
  return {
    intent: allowed[normalizedIntent] ? normalizedIntent : "unknown",
    month,
    category,
    source: "Gemini",
  };
}

function normalizeIntentMonth_(month) {
  const value = String(month || "").trim().toLowerCase();
  if (!value) {
    return "";
  }
  if (/^\d{4}-\d{2}$/.test(value)) {
    return value;
  }
  if (value === "current") {
    return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM");
  }
  if (value === "previous") {
    return previousMonthKey_();
  }
  if (value === "latest") {
    return "latest";
  }
  return requestedMonthFromText_(value) || "";
}

function executeNaturalLanguageIntent_(intent, rawText) {
  const commandText = commandTextFromIntent_(intent, rawText);
  const sourceNote = naturalSourceNote_(intent);
  rememberNaturalIntent_(intent, rawText, commandText);

  if (intent.intent === "chart") {
    sendTelegramMessage_(`${buildNaturalFinanceReply_(intent, rawText, commandText)}\n\n${sourceNote}`);
    sendDashboardCharts_(commandText);
    return;
  }

  const reply = buildNaturalFinanceReply_(intent, rawText, commandText);
  sendTelegramMessage_(`${reply}\n\n${sourceNote}`);
}

function naturalSourceNote_(intent) {
  const answerSource = property_("GEMINI_API_KEY") ? "Gemini" : "template fallback";
  return `Đã hiểu ý bằng: ${intent && intent.source ? intent.source : "không rõ"}; trả lời bằng: ${answerSource}`;
}

function buildNaturalFinanceReply_(intent, rawText, commandText) {
  if (!property_("GEMINI_API_KEY")) {
    return fallbackReplyForIntent_(intent, rawText, commandText);
  }

  const safeData = safeDataForIntent_(intent, rawText, commandText);
  const factualAnswer = factualAnswerForIntent_(intent, rawText, commandText, safeData);
  const prompt = [
    "IMPORTANT: You already have all available data in safe_data and factual_answer. Give the final answer now.",
    "Never say you are fetching, checking, loading, waiting, or that you will answer later.",
    "If the data is zero, say the sheet currently has no recorded data for that period.",
    "Include the key numbers from factual_answer when answering finance questions.",
    "Bạn là Finance Agent, trợ lý tài chính cá nhân trong Telegram.",
    "Trả lời bằng tiếng Việt tự nhiên, thân thiện, ngắn gọn.",
    "Chỉ dùng dữ liệu trong safe_data. Không bịa số liệu, không suy diễn giao dịch không có trong dữ liệu.",
    "Không yêu cầu hoặc tiết lộ API key, token, mật khẩu, mã OTP, mã dự phòng, email token, thông tin đăng nhập.",
    "Không đưa lời khuyên đầu tư/pháp lý/y tế chuyên nghiệp. Nếu cần, chỉ đưa gợi ý quản lý chi tiêu cá nhân ở mức tham khảo.",
    "Không nhắc tên người nhận thật nếu safe_data đã ẩn danh. Không nói rằng bạn đã xem toàn bộ email hay raw transaction.",
    "Nếu dữ liệu bằng 0, nói rõ có thể do chưa có giao dịch hoặc chưa ghi nhận dữ liệu trong tháng đó.",
    "Nếu câu hỏi ngoài phạm vi tài chính cá nhân, giới thiệu ngắn bạn làm được gì và gợi ý câu hỏi phù hợp.",
    "Tối đa 6 câu. Không dùng bảng markdown.",
    `intent: ${intent.intent}`,
    `user_question: ${rawText}`,
    `factual_answer: ${factualAnswer}`,
    `safe_data: ${JSON.stringify(safeData)}`,
  ].join("\n");

  const reply = trim_(generateGeminiText_(prompt, 700), 1600);
  if (reply && !badNaturalFinanceReply_(reply, intent)) {
    return reply;
  }
  return factualAnswer || fallbackReplyForIntent_(intent, rawText, commandText);
}

function badNaturalFinanceReply_(reply, intent) {
  if (!intent || ["help", "about_bot"].includes(intent.intent)) {
    return false;
  }
  return /(dang lay|dang kiem tra|cho mot chut|minh se|hen tra loi|vui long cung cap|cung cap them|fetching|checking|loading|waiting|will get back)/i.test(
    normalize_(reply)
  );
}

function factualAnswerForIntent_(intent, rawText, commandText, safeData) {
  if (intent.intent === "dashboard" || intent.intent === "summary" || intent.intent === "report") {
    return compactDashboardFacts_(safeData);
  }
  if (intent.intent === "top") {
    return compactTopFacts_(safeData);
  }
  if (intent.intent === "category_spend") {
    return compactCategoryFacts_(safeData);
  }
  if (intent.intent === "debt") {
    return compactDebtFacts_(safeData);
  }
  if (intent.intent === "uncategorized") {
    return `Hiện có ${Number(safeData.needsReview || 0)} giao dịch cần phân loại.`;
  }
  return "";
}

function compactDashboardFacts_(data) {
  return [
    `Tháng ${data.month}: chi tiêu sinh hoạt ${formatMoney_(data.livingExpense)}, thu nhập thật ${formatMoney_(data.income)}, dòng tiền ròng ${formatMoney_(data.netLivingCashflow)}.`,
    `Có ${Number(data.includedSpendingCount || 0)}/${Number(data.transactionCount || 0)} giao dịch được tính vào chi tiêu; ${Number(data.needsReview || 0)} giao dịch cần phân loại.`,
    data.topCategories && data.topCategories.length
      ? `Nhóm chi nhiều nhất: ${data.topCategories[0].category} - ${formatMoney_(data.topCategories[0].amount)}.`
      : "Chưa có category chi tiêu nổi bật trong dữ liệu.",
    `Vay nhận vào ${formatMoney_(data.loanReceived)}, trả nợ gốc ${formatMoney_(data.loanPrincipalPaid)}, cho vay ${formatMoney_(data.loanGiven)}, thu hồi cho vay ${formatMoney_(data.loanCollected)}.`,
  ].join("\n");
}

function compactTopFacts_(data) {
  const categories = data.topCategories || [];
  if (!categories.length) {
    return `Tháng ${data.month} chưa có dữ liệu top chi tiêu.`;
  }
  return `Top chi tiêu tháng ${data.month}: ${categories
    .slice(0, 3)
    .map((row, index) => `${index + 1}. ${row.category} ${formatMoney_(row.amount)}`)
    .join("; ")}.`;
}

function compactCategoryFacts_(data) {
  return `Tháng ${data.month}, nhóm ${data.category || "category này"} có tổng chi ${formatMoney_(data.amount)} với ${Number(
    data.transactionCount || 0
  )} giao dịch.`;
}

function compactDebtFacts_(data) {
  return `Hiện có ${Number(data.openItems || 0)} khoản vay/nợ còn mở; bạn còn nợ ${formatMoney_(
    data.totalYouOwe
  )}, người khác còn nợ bạn ${formatMoney_(data.totalOthersOweYou)}.`;
}

function safeDataForIntent_(intent, rawText, commandText) {
  if (intent.intent === "help") {
    return { type: "help", commands: ["/dashboard", "/chart", "/summary", "/report", "/top", "/debt", "/uncategorized"] };
  }
  if (intent.intent === "about_bot") {
    return {
      type: "about_bot",
      capabilities: [
        "đọc email giao dịch ngân hàng đã được cấp quyền",
        "ghi giao dịch vào Google Sheets",
        "phân loại chi tiêu qua rule và phản hồi Telegram",
        "theo dõi vay/nợ",
        "gửi dashboard, report và biểu đồ",
      ],
      privacy: "không tự ý truy cập dữ liệu ngoài quyền người dùng đã cấp; không yêu cầu token, mật khẩu, OTP",
    };
  }
  if (intent.intent === "debt") {
    return safeDebtSummary_();
  }
  if (intent.intent === "uncategorized") {
    return safeUncategorizedSummary_();
  }
  if (intent.intent === "category_spend") {
    return safeCategorySpendSummary_(commandText, intent.category || rawText);
  }

  const metrics = metricsForCommandMonth_(commandText);
  const summary = privacySafeMetricsSummary_(metrics);
  summary.type = intent.intent;
  return summary;
}

function safeCategorySpendSummary_(text, categoryText) {
  const category = categoryFromText_(categoryText);
  const metrics = metricsForCommandMonth_(text);
  if (!category) {
    return { type: "category_spend", month: metrics.month, category: "", amount: 0, transactionCount: 0 };
  }

  const target = normalize_(category);
  const rows = forceRowsForDashboard_().filter((row) => {
    const month = forceMonthKey_(row[3], row[2]);
    return month === metrics.month && forceBool_(row[8]) && normalize_(row[6]) === target;
  });
  const headers = SpreadsheetApp.getActive().getSheetByName(APP.transactionsSheet).getDataRange().getValues()[0] || TRANSACTION_HEADERS;
  const col = columns_(headers);
  const amount = rows.reduce((sum, row) => sum + spendingAmountFromArray_(row, col), 0);
  const counterparties = {};
  rows.forEach((row) => addToMap_(counterparties, `recipient_${Object.keys(counterparties).length + 1}`, spendingAmountFromArray_(row, col)));
  return {
    type: "category_spend",
    month: metrics.month,
    category,
    amount,
    transactionCount: rows.length,
    topRecipients: topRows_(counterparties, 3).map((row) => ({ label: row[0], amount: Number(row[1] || 0) })),
  };
}

function safeDebtSummary_() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(APP.debtSheet);
  if (!sheet || sheet.getLastRow() < 2) {
    return { type: "debt", openItems: 0, totalYouOwe: 0, totalOthersOweYou: 0 };
  }

  const values = sheet.getDataRange().getValues();
  let totalYouOwe = 0;
  let totalOthersOweYou = 0;
  let openItems = 0;
  values.slice(1).forEach((row) => {
    const youOwe = Number(row[5] || 0);
    const othersOwe = Number(row[6] || 0);
    if (youOwe || othersOwe) {
      openItems += 1;
      totalYouOwe += youOwe;
      totalOthersOweYou += othersOwe;
    }
  });
  return { type: "debt", openItems, totalYouOwe, totalOthersOweYou };
}

function safeUncategorizedSummary_() {
  const rows = forceRowsForDashboard_();
  const count = rows.filter((row) => String(row[7] || "").trim() === "needs_review" || String(row[9] || "").trim() === "needs_review").length;
  return { type: "uncategorized", needsReview: count };
}

function fallbackReplyForIntent_(intent, rawText, commandText) {
  if (intent.intent === "help") {
    return financeHelpText_();
  }
  if (intent.intent === "about_bot") {
    return buildAboutBotReply_(rawText);
  }
  if (intent.intent === "dashboard" || intent.intent === "summary") {
    return buildDashboardReply_(commandText);
  }
  if (intent.intent === "report") {
    return buildReportReplyWithInsight_(commandText);
  }
  if (intent.intent === "top") {
    return buildTopReply_(commandText);
  }
  if (intent.intent === "debt") {
    return buildDebtReply_();
  }
  if (intent.intent === "uncategorized") {
    return buildUncategorizedReply_();
  }
  if (intent.intent === "category_spend") {
    return buildCategorySpendReply_(commandText, intent.category || rawText);
  }
  return financeHelpText_();
}

function buildGuardedGeneralReply_(text, intent) {
  if (!property_("GEMINI_API_KEY")) {
    return [
      "Mình chưa hiểu câu này trong phạm vi tài chính cá nhân.",
      "Bạn có thể hỏi: tháng này tôi tiêu bao nhiêu, ăn uống tháng 7 thế nào, tôi còn nợ ai, gửi biểu đồ tháng 7.",
    ].join("\n");
  }

  const prompt = [
    "Bạn là Finance Agent, trợ lý tài chính cá nhân trong Telegram.",
    "Trả lời bằng tiếng Việt tự nhiên, ngắn gọn.",
    "Guardrails:",
    "- Không yêu cầu hoặc tiết lộ API key, token, mật khẩu, OTP, mã dự phòng.",
    "- Không tự nhận có quyền truy cập dữ liệu ngoài Gmail/Sheets/Telegram mà người dùng đã cấp.",
    "- Không đưa lời khuyên đầu tư, pháp lý, y tế chuyên nghiệp.",
    "- Nếu câu hỏi ngoài phạm vi tài chính cá nhân, hãy nói bạn chủ yếu giúp quản lý chi tiêu, dashboard, phân loại giao dịch, vay/nợ.",
    "- Không bịa số liệu tài chính khi không có safe_data.",
    `Câu hỏi: ${text}`,
    `intent_source: ${intent && intent.source ? intent.source : "unknown"}`,
  ].join("\n");

  const reply = trim_(generateGeminiText_(prompt, 520), 1200);
  return reply || "Mình chưa hiểu câu này. Bạn thử hỏi về chi tiêu, dashboard, report, biểu đồ hoặc vay/nợ nhé.";
}

function executeFinanceIntent_(intent, rawText) {
  const commandText = commandTextFromIntent_(intent, rawText);
  const sourceNote = intentSourceNote_(intent);
  if (intent.intent === "help") {
    sendTelegramMessage_(financeHelpText_());
    return;
  }
  if (intent.intent === "about_bot") {
    sendTelegramMessage_(`${buildAboutBotReply_(rawText)}\n\n${sourceNote}`);
    return;
  }
  if (intent.intent === "dashboard") {
    sendTelegramMessage_(`${buildDashboardReply_(commandText)}\n\n${sourceNote}`);
    sendDashboardCharts_(commandText);
    return;
  }
  if (intent.intent === "summary") {
    sendTelegramMessage_(`${buildDashboardReply_(commandText)}\n\n${sourceNote}`);
    return;
  }
  if (intent.intent === "chart") {
    sendTelegramMessage_(sourceNote);
    sendDashboardCharts_(commandText);
    return;
  }
  if (intent.intent === "report") {
    sendTelegramMessage_(`${buildReportReplyWithInsight_(commandText)}\n\n${sourceNote}`);
    return;
  }
  if (intent.intent === "top") {
    sendTelegramMessage_(`${buildTopReply_(commandText)}\n\n${sourceNote}`);
    return;
  }
  if (intent.intent === "debt") {
    sendTelegramMessage_(`${buildDebtReply_()}\n\n${sourceNote}`);
    return;
  }
  if (intent.intent === "uncategorized") {
    sendTelegramMessage_(`${buildUncategorizedReply_()}\n\n${sourceNote}`);
    return;
  }
  if (intent.intent === "category_spend") {
    sendTelegramMessage_(`${buildCategorySpendReply_(commandText, intent.category || rawText)}\n\n${sourceNote}`);
    return;
  }
  sendTelegramMessage_(financeHelpText_());
}

function intentSourceNote_(intent) {
  return `Đã hiểu bằng: ${intent && intent.source ? intent.source : "không rõ"}`;
}

function buildAboutBotReply_(question) {
  const prompt = [
    "Bạn là Finance Agent, một trợ lý quản lý tài chính cá nhân chạy qua Telegram.",
    "Trả lời bằng tiếng Việt tự nhiên, thân thiện, ngắn gọn trong 4-6 câu.",
    "Nói rõ bạn có thể đọc giao dịch ngân hàng từ Gmail qua Apps Script, ghi vào Google Sheets, phân loại chi tiêu, theo dõi vay/nợ, gửi dashboard/report và biểu đồ qua Telegram.",
    "Nói rõ bạn không phải cố vấn tài chính chuyên nghiệp và không tự ý truy cập dữ liệu ngoài các quyền người dùng đã cấp.",
    "Không nhắc đến prompt hay JSON.",
    `Câu hỏi của người dùng: ${question}`,
  ].join("\n");

  const reply = trim_(generateGeminiText_(prompt, 520), 1200);
  if (reply) {
    return reply;
  }
  return [
    "Mình là Finance Agent, trợ lý quản lý tài chính cá nhân của bạn trên Telegram.",
    "Mình giúp đọc email giao dịch ngân hàng, ghi dữ liệu vào Google Sheets, phân loại chi tiêu, theo dõi vay/nợ và gửi dashboard/report.",
    "Bạn có thể hỏi mình bằng câu tự nhiên như: tháng 7 tôi tiêu thế nào, ăn uống tháng này bao nhiêu, tôi còn nợ ai.",
  ].join("\n");
}

function commandTextFromIntent_(intent, rawText) {
  const month = intent.month || requestedMonthFromText_(rawText) || (wantsLatestMonth_(rawText) ? "latest" : "");
  const suffix = month ? ` ${month}` : "";
  return `/${intent.intent}${suffix}`;
}

function buildCategorySpendReply_(text, categoryText) {
  const category = categoryFromText_(categoryText);
  if (!category) {
    return "Bạn muốn xem category nào? Ví dụ: ăn uống tháng này bao nhiêu.";
  }

  const metrics = metricsForCommandMonth_(text);
  const target = normalize_(category);
  const rows = forceRowsForDashboard_().filter((row) => {
    const month = forceMonthKey_(row[3], row[2]);
    return month === metrics.month && forceBool_(row[8]) && normalize_(row[6]) === target;
  });

  const headers = SpreadsheetApp.getActive().getSheetByName(APP.transactionsSheet).getDataRange().getValues()[0] || TRANSACTION_HEADERS;
  const col = columns_(headers);
  const amount = rows.reduce((sum, row) => sum + spendingAmountFromArray_(row, col), 0);
  const counterparties = {};
  rows.forEach((row) => addToMap_(counterparties, String(row[10] || "Không rõ"), spendingAmountFromArray_(row, col)));
  const top = topRows_(counterparties, 3);
  const lines = [
    `${category} ${metrics.month}`,
    `Tổng chi: ${formatMoney_(amount)}`,
    `Số giao dịch: ${rows.length}`,
  ];
  if (top.length) {
    lines.push("", "Top nơi nhận tiền:");
    top.forEach((row, index) => lines.push(`${index + 1}. ${row[0]}: ${formatMoney_(row[1])}`));
  }
  appendCategoryAiInsight_(lines, metrics.month, category, amount, rows.length, top);
  return lines.join("\n");
}

function appendCategoryAiInsight_(lines, month, category, amount, count, topRows) {
  if (!property_("GEMINI_API_KEY")) {
    return;
  }

  const prompt = [
    "Bạn là trợ lý phân tích chi tiêu cá nhân bằng tiếng Việt.",
    "Chỉ diễn giải từ số liệu tổng hợp, không bịa thêm giao dịch.",
    "Trả lời tự nhiên trong 2-3 câu ngắn.",
    "Không nhắc tên người nhận thật; nếu cần chỉ nói top nơi nhận tiền.",
    `Dữ liệu: ${JSON.stringify({
      month,
      category,
      amount: Number(amount || 0),
      transactionCount: Number(count || 0),
      topRecipients: (topRows || []).map((row, index) => ({
        label: `recipient_${index + 1}`,
        amount: Number(row[1] || 0),
      })),
    })}`,
  ].join("\n");

  const insight = trim_(generateGeminiText_(prompt, 360), 800);
  if (insight) {
    lines.push("", "Nhận xét AI:", insight);
  }
}

function categoryFromText_(text) {
  const normalized = normalize_(text);
  const aliases = [
    ["an uong", "Ăn uống"],
    ["anuong", "Ăn uống"],
    ["food", "Ăn uống"],
    ["cafe", "Ăn uống"],
    ["sieu thi", "Siêu thị"],
    ["sieuthi", "Siêu thị"],
    ["winmart", "Siêu thị"],
    ["mua sam", "Mua sắm"],
    ["muasam", "Mua sắm"],
    ["shopping", "Mua sắm"],
    ["di chuyen", "Di chuyển"],
    ["dichuyen", "Di chuyển"],
    ["grab", "Di chuyển"],
    ["taxi", "Di chuyển"],
    ["gia dinh", "Gia đình"],
    ["giadinh", "Gia đình"],
    ["nha cua", "Nhà cửa"],
    ["nhacua", "Nhà cửa"],
    ["hoc tap", "Học tập"],
    ["hoctap", "Học tập"],
    ["suc khoe", "Sức khỏe"],
    ["suckhoe", "Sức khỏe"],
    ["giai tri", "Giải trí"],
    ["giaitri", "Giải trí"],
    ["vay nhan vao", "Vay nhận vào"],
    ["tra no goc", "Trả nợ gốc"],
    ["cho vay", "Cho vay"],
    ["thu hoi cho vay", "Thu hồi cho vay"],
    ["chi phi tai chinh", "Chi phí tài chính"],
    ["chuyen khoan noi bo", "Chuyển khoản nội bộ"],
  ];
  const match = aliases.find((row) => normalized.includes(row[0]));
  return match ? match[1] : "";
}

function updateTransactionCategory_(transactionId, category, cashflowType, includeInSpending) {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(APP.transactionsSheet);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const col = columns_(headers);

  for (let i = 1; i < values.length; i++) {
    if (values[i][col.transaction_id] !== transactionId) {
      continue;
    }

    sheet.getRange(i + 1, col.category + 1).setValue(category);
    sheet.getRange(i + 1, col.review_status + 1).setValue("confirmed");
    sheet.getRange(i + 1, col.include_in_spending + 1).setValue(includeInSpending);
    sheet.getRange(i + 1, col.cashflow_type + 1).setValue(cashflowType);

    const amount = Number(values[i][col.amount] || 0);
    sheet.getRange(i + 1, col.principal_amount + 1).setValue(principalFor_(cashflowType, amount));
    sheet.getRange(i + 1, col.interest_amount + 1).setValue(cashflowType === "financial_cost" ? amount : 0);
    if (isDebtCashflow_(cashflowType) && !values[i][col.debt_person]) {
      sheet.getRange(i + 1, col.debt_person + 1).setValue(values[i][col.counterparty] || "");
    }
    return true;
  }

  return false;
}

function splitExpenseReply_(text) {
  const parsed = parseSplitCommand_(text);
  if (!parsed.ok) {
    return [
      "Cú pháp chia bill:",
      "/split latest 2",
      "/split 120000 3",
      "/split 120000 3 50000",
      "",
      "Nghĩa là: tổng giao dịch vẫn giữ nguyên, nhưng dashboard chỉ tính phần của bạn.",
    ].join("\n");
  }

  const result = applySplitExpense_(parsed);
  if (!result.ok) {
    return result.message;
  }

  refreshSummaries_();
  forceRebuildDashboard_(SpreadsheetApp.getActive());

  return [
    "Đã cập nhật chia bill.",
    `Giao dịch: ${result.counterparty}`,
    `Tổng tiền ngân hàng trừ: ${formatMoney_(result.amount)}`,
    `Phần tính vào chi tiêu của bạn: ${formatMoney_(result.personalAmount)}`,
    `Phần người khác cần hoàn lại: ${formatMoney_(result.reimbursableAmount)}`,
    "",
    "Dashboard đã được làm mới theo phần chi tiêu cá nhân.",
  ].join("\n");
}

function parseSplitCommand_(text) {
  const parts = String(text || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length < 3) {
    return { ok: false };
  }

  const target = parts[1].toLowerCase();
  const people = Number(parts[2]);
  if (!Number.isFinite(people) || people < 2) {
    return { ok: false };
  }

  const explicitPersonalAmount = parts[3] ? forceNumber_(parts[3]) : 0;
  if (target === "latest" || target === "last") {
    return { ok: true, mode: "latest", people, explicitPersonalAmount };
  }

  const targetAmount = forceNumber_(target);
  if (!targetAmount) {
    return { ok: false };
  }
  return { ok: true, mode: "amount", targetAmount, people, explicitPersonalAmount };
}

function applySplitExpense_(parsed) {
  const ss = SpreadsheetApp.getActive();
  setupSheets_(ss);
  const sheet = ss.getSheetByName(APP.transactionsSheet);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    return { ok: false, message: "Chưa có giao dịch để chia bill." };
  }

  const headers = values[0];
  const col = columns_(headers);
  const match = findSplitTargetRow_(values, col, parsed);
  if (!match) {
    return { ok: false, message: "Không tìm thấy giao dịch phù hợp để chia bill." };
  }

  const rowNumber = match.index + 1;
  const amount = forceNumber_(values[match.index][col.amount]);
  const personalAmount = parsed.explicitPersonalAmount > 0 ? parsed.explicitPersonalAmount : Math.round(amount / parsed.people);
  const reimbursableAmount = Math.max(amount - personalAmount, 0);
  const note = `split ${parsed.people} people; personal=${personalAmount}; reimbursable=${reimbursableAmount}`;

  sheet.getRange(rowNumber, col.personal_amount + 1).setValue(personalAmount);
  sheet.getRange(rowNumber, col.shared_with_count + 1).setValue(parsed.people);
  sheet.getRange(rowNumber, col.reimbursable_amount + 1).setValue(reimbursableAmount);
  sheet.getRange(rowNumber, col.split_note + 1).setValue(note);

  return {
    ok: true,
    amount,
    personalAmount,
    reimbursableAmount,
    counterparty: values[match.index][col.counterparty] || "Không rõ",
  };
}

function findSplitTargetRow_(values, col, parsed) {
  for (let i = values.length - 1; i >= 1; i--) {
    const row = values[i];
    if (!row.some((cell) => cell !== "" && cell !== null)) {
      continue;
    }
    if (!forceBool_(row[col.include_in_spending]) || String(row[col.cashflow_type] || "") !== "spending") {
      continue;
    }
    const amount = forceNumber_(row[col.amount]);
    if (parsed.mode === "latest" || amount === parsed.targetAmount) {
      return { index: i };
    }
  }
  return null;
}

function maybeAskTelegram_(transaction) {
  if (transaction.review_status !== "needs_review") {
    sendTelegramMessage_(formatTransactionMessage_(transaction));
    return;
  }

  const text = [
    "Cần phân loại giao dịch:",
    `${formatMoney_(transaction.amount)} - ${transaction.counterparty || "Không rõ người nhận/gửi"}`,
    `Nội dung: ${transaction.content || "(trống)"}`,
    "",
    "Nếu đây là vay/trả nợ, chọn nhóm nợ để dashboard không đếm trùng.",
  ].join("\n");

  const messageId = sendTelegramMessage_(text, buildCategoryKeyboard_(transaction.transaction_id));
  if (messageId) {
    setTelegramMessageId_(transaction.transaction_id, messageId);
  }
}

function buildCategoryKeyboard_(transactionId) {
  const rows = [];
  for (let i = 0; i < TELEGRAM_CATEGORIES.length; i += 2) {
    const row = [];
    for (let j = i; j < Math.min(i + 2, TELEGRAM_CATEGORIES.length); j++) {
      row.push({
        text: TELEGRAM_CATEGORIES[j][0],
        callback_data: `cat|${transactionId}|${j}`,
      });
    }
    rows.push(row);
  }
  return { inline_keyboard: rows };
}

function refreshSummaries_() {
  const ss = SpreadsheetApp.getActive();
  const rows = objectsFromSheet_(ss.getSheetByName(APP.transactionsSheet));
  refreshMonthlySummary_(ss, rows);
  refreshDebtSummary_(ss, rows);
}

function refreshMonthlySummary_(ss, rows) {
  const buckets = {};
  rows.forEach((row) => {
    const month = row.month || "";
    if (!month) {
      return;
    }
    if (!buckets[month]) {
      buckets[month] = {
        income: 0,
        expense: 0,
        loan_received: 0,
        loan_principal_paid: 0,
        loan_given: 0,
        loan_collected: 0,
        interest_or_fee: 0,
        needs_review_count: 0,
      };
    }

    const amount = Number(row.amount || 0);
    const interest = Number(row.interest_amount || 0);
    if (row.review_status === "needs_review") {
      buckets[month].needs_review_count += 1;
    }
    if (row.cashflow_type === "income") {
      buckets[month].income += amount;
    }
    if (String(row.include_in_spending).toLowerCase() === "true") {
      buckets[month].expense += spendingAmountFromObject_(row);
    }
    if (row.cashflow_type === "loan_in") {
      buckets[month].loan_received += amount;
    }
    if (row.cashflow_type === "loan_repayment") {
      buckets[month].loan_principal_paid += Number(row.principal_amount || amount);
      buckets[month].expense += interest;
      buckets[month].interest_or_fee += interest;
    }
    if (row.cashflow_type === "loan_out") {
      buckets[month].loan_given += amount;
    }
    if (row.cashflow_type === "loan_collection") {
      buckets[month].loan_collected += amount;
    }
    if (row.cashflow_type === "financial_cost") {
      buckets[month].interest_or_fee += amount;
    }
  });

  const summarySheet = getOrCreateSheet_(ss, APP.monthlySheet, MONTHLY_HEADERS);
  summarySheet.clearContents();
  summarySheet.appendRow(MONTHLY_HEADERS);
  Object.keys(buckets).sort().forEach((month) => {
    const b = buckets[month];
    summarySheet.appendRow([
      month,
      b.income,
      b.expense,
      b.income - b.expense,
      b.loan_received,
      b.loan_principal_paid,
      b.loan_given,
      b.loan_collected,
      b.interest_or_fee,
      b.needs_review_count,
    ]);
  });
  formatSheet_(summarySheet);
}

function refreshDebtSummary_(ss, rows) {
  const buckets = {};
  rows.forEach((row) => {
    if (!isDebtCashflow_(row.cashflow_type)) {
      return;
    }
    const person = row.debt_person || row.counterparty || "Không rõ";
    if (!buckets[person]) {
      buckets[person] = {
        borrowed_from_others: 0,
        principal_repaid: 0,
        lent_to_others: 0,
        collected_from_others: 0,
      };
    }

    const amount = Number(row.amount || 0);
    if (row.cashflow_type === "loan_in") {
      buckets[person].borrowed_from_others += amount;
    }
    if (row.cashflow_type === "loan_repayment") {
      buckets[person].principal_repaid += Number(row.principal_amount || amount);
    }
    if (row.cashflow_type === "loan_out") {
      buckets[person].lent_to_others += amount;
    }
    if (row.cashflow_type === "loan_collection") {
      buckets[person].collected_from_others += amount;
    }
  });

  const debtSheet = getOrCreateSheet_(ss, APP.debtSheet, DEBT_HEADERS);
  debtSheet.clearContents();
  debtSheet.appendRow(DEBT_HEADERS);
  Object.keys(buckets).sort().forEach((person) => {
    const b = buckets[person];
    debtSheet.appendRow([
      person,
      b.borrowed_from_others,
      b.principal_repaid,
      b.lent_to_others,
      b.collected_from_others,
      Math.max(0, b.borrowed_from_others - b.principal_repaid),
      Math.max(0, b.lent_to_others - b.collected_from_others),
    ]);
  });
  formatSheet_(debtSheet);
}

function refreshDashboard_(ss, rows) {
  const dashboard = recreateSheet_(ss, APP.dashboardSheet, ["metric", "value"]);

  const now = new Date();
  const currentMonth = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM");
  const monthRows = rows.filter((row) => monthKeyFromRow_(row) === currentMonth);

  let income = 0;
  let expense = 0;
  let loanReceived = 0;
  let loanPrincipalPaid = 0;
  let loanGiven = 0;
  let loanCollected = 0;
  let interestOrFee = 0;
  let needsReview = 0;
  const categoryTotals = {};

  monthRows.forEach((row) => {
    const amount = Number(row.amount || 0);
    const interest = Number(row.interest_amount || 0);
    if (row.review_status === "needs_review") {
      needsReview += 1;
    }
    if (row.cashflow_type === "income") {
      income += amount;
    }
    if (String(row.include_in_spending).toLowerCase() === "true") {
      expense += spendingAmountFromObject_(row);
      const category = row.category || "Khác";
      categoryTotals[category] = (categoryTotals[category] || 0) + spendingAmountFromObject_(row);
    }
    if (row.cashflow_type === "loan_in") {
      loanReceived += amount;
    }
    if (row.cashflow_type === "loan_repayment") {
      loanPrincipalPaid += Number(row.principal_amount || amount);
      interestOrFee += interest;
    }
    if (row.cashflow_type === "loan_out") {
      loanGiven += amount;
    }
    if (row.cashflow_type === "loan_collection") {
      loanCollected += amount;
    }
    if (row.cashflow_type === "financial_cost") {
      interestOrFee += amount;
    }
  });

  const summaryRows = [
    ["Tháng", currentMonth],
    ["Thu nhập thật", income],
    ["Chi tiêu sinh hoạt", expense],
    ["Dòng tiền sinh hoạt ròng", income - expense],
    ["Vay nhận vào", loanReceived],
    ["Trả nợ gốc", loanPrincipalPaid],
    ["Cho vay", loanGiven],
    ["Thu hồi cho vay", loanCollected],
    ["Lãi/phí vay", interestOrFee],
    ["Giao dịch cần phân loại", needsReview],
  ];

  dashboard.getRange(1, 1, 1, 2).setValues([["metric", "value"]]);
  dashboard.getRange(2, 1, summaryRows.length, 2).setValues(summaryRows);
  dashboard.getRange(1, 4, 1, 2).setValues([["category", "expense"]]);

  const categoryRows = Object.keys(categoryTotals)
    .sort((a, b) => categoryTotals[b] - categoryTotals[a])
    .map((category) => [category, categoryTotals[category]]);
  if (categoryRows.length) {
    dashboard.getRange(2, 4, categoryRows.length, 2).setValues(categoryRows);
    const chart = dashboard
      .newChart()
      .setChartType(Charts.ChartType.PIE)
      .addRange(dashboard.getRange(1, 4, categoryRows.length + 1, 2))
      .setPosition(2, 7, 0, 0)
      .setOption("title", "Chi tiêu theo category")
      .build();
    dashboard.insertChart(chart);
  }

  formatSheet_(dashboard);
  dashboard.getRange(2, 2, Math.max(summaryRows.length, 1), 1).setNumberFormat('#,##0 "VND"');
  if (categoryRows.length) {
    dashboard.getRange(2, 5, categoryRows.length, 1).setNumberFormat('#,##0 "VND"');
  }
}

function looksLikeFinancialNotice_(record, text) {
  const haystack = normalize_(`${record.from} ${record.subject} ${text}`);
  const senderLooksFinancial = /(mbbank|mb bank|mbebanking|vietcombank|techcombank|vpbank|bidv|tpbank|momo|zalopay|vnpay)/i.test(haystack);
  const hasTransactionWords = /(giao dich|so tien|thanh toan|chuyen khoan|transaction|payment|credit|debit)/i.test(haystack);
  const hasCurrency = /\b(vnd|vnđ)\b|đ/i.test(text);
  return senderLooksFinancial && hasTransactionWords && hasCurrency;
}

function extractAmount_(text) {
  const labeled = labeledField_(text, ["Số tiền giao dịch", "Số tiền", "Amount"]);
  const fromLabel = parseAmount_(labeled);
  if (fromLabel) {
    return fromLabel;
  }

  const lines = text.split(/\r?\n/);
  let best = null;
  lines.forEach((line) => {
    const normalized = normalize_(line);
    if (/https?:\/\//i.test(line)) {
      return;
    }
    const matches = line.matchAll(/([+-]?\s*\d{1,3}(?:[.,]\d{3})+|[+-]?\s*\d+)\s*(VND|VNĐ|đ|d)?/gi);
    for (const match of matches) {
      const value = parseAmount_(match[0]);
      if (!value || Math.abs(value) < 1000 || Math.abs(value) > 1000000000) {
        continue;
      }
      const hasContext = /(so tien|amount|giao dich|thanh toan|chuyen khoan|vnd|vnđ)/i.test(normalized);
      if (!hasContext) {
        continue;
      }
      best = value;
      return;
    }
  });
  return best;
}

function parseAmount_(value) {
  if (!value) {
    return null;
  }
  const match = String(value).match(/([+-]?\s*\d{1,3}(?:[.,]\d{3})+|[+-]?\s*\d+)/);
  if (!match) {
    return null;
  }
  const number = Number(match[1].replace(/\s/g, "").replace(/[.,]/g, ""));
  return Number.isFinite(number) ? number : null;
}

function extractDate_(text) {
  const value = labeledField_(text, ["Ngày, giờ giao dịch", "Thời gian", "Ngày giao dịch"]);
  const match = value.match(/(\d{2})[-/](\d{2})[-/](\d{4})\s+(\d{2}):(\d{2})(?::(\d{2}))?/);
  if (!match) {
    return null;
  }
  return new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]), Number(match[4]), Number(match[5]), Number(match[6] || 0));
}

function detectType_(text, amount) {
  const normalized = normalize_(text);
  if (amount < 0) {
    return "expense";
  }
  if (/(ghi no|tru tien|trich no|chuyen tien di|thanh toan|debit)/i.test(normalized)) {
    return "expense";
  }
  if (/(ghi co|cong tien|nhan tien|chuyen tien den|credit)/i.test(normalized)) {
    return "income";
  }
  if (/(nguoi thu huong|tai khoan trich no)/i.test(normalized)) {
    return "expense";
  }
  return "expense";
}

function detectBank_(from, subject) {
  const value = normalize_(`${from} ${subject}`);
  if (value.includes("mbbank") || value.includes("mb bank") || value.includes("mbebanking")) {
    return "MB Bank";
  }
  if (value.includes("vietcombank") || value.includes("vcb")) {
    return "Vietcombank";
  }
  if (value.includes("techcombank") || value.includes("tcb")) {
    return "Techcombank";
  }
  if (value.includes("vpbank")) {
    return "VPBank";
  }
  if (value.includes("momo")) {
    return "MoMo";
  }
  return "Unknown";
}

function labeledField_(text, labels) {
  const collapsed = String(text).replace(/\s+/g, " ").trim();
  const stopLabels = [
    "Ngày, giờ giao dịch",
    "Loại giao dịch",
    "Số tham chiếu",
    "Tài khoản trích nợ",
    "Tài khoản ghi có",
    "Người thụ hưởng",
    "Người nhận",
    "Người gửi",
    "Số tiền giao dịch",
    "Nội dung chuyển tiền",
    "Nội dung",
    "Cách thức lệnh",
    "Ngày nhập lệnh",
    "Thời gian",
    "Tình trạng",
  ];

  for (const label of labels) {
    const pattern = new RegExp(
      escapeRegExp_(label) + "\\s*(.*?)(?=\\s+(?:" + stopLabels.map(escapeRegExp_).join("|") + ")\\b|$)",
      "i"
    );
    const match = collapsed.match(pattern);
    if (match && match[1]) {
      return trim_(match[1].replace(/^[:\-\s]+/, ""), 180);
    }
  }
  return "";
}

function bestContentLine_(body) {
  const lines = String(body).split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  return lines.find((line) => /(noi dung|nội dung|remark|description)/i.test(normalize_(line))) || lines[0] || "";
}

function principalFor_(cashflowType, amount) {
  return isDebtCashflow_(cashflowType) ? amount : 0;
}

function debtPersonFor_(cashflowType, counterparty) {
  return isDebtCashflow_(cashflowType) ? trim_(maskSensitive_(counterparty || ""), 120) : "";
}

function isDebtCashflow_(cashflowType) {
  return ["loan_in", "loan_repayment", "loan_out", "loan_collection"].includes(cashflowType);
}

function sendTelegramMessage_(text, replyMarkup) {
  const token = property_("TELEGRAM_BOT_TOKEN");
  const chatId = property_("TELEGRAM_CHAT_ID");
  if (!token || !chatId) {
    return "";
  }

  const payload = {
    chat_id: chatId,
    text,
    disable_web_page_preview: true,
  };
  if (replyMarkup) {
    payload.reply_markup = replyMarkup;
  }

  const response = UrlFetchApp.fetch(telegramUrl_("sendMessage"), {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });
  const json = JSON.parse(response.getContentText() || "{}");
  return json.ok && json.result ? json.result.message_id : "";
}

function sendDashboardCharts_(text) {
  const token = property_("TELEGRAM_BOT_TOKEN");
  const chatId = property_("TELEGRAM_CHAT_ID");
  if (!token || !chatId) {
    return;
  }

  const metrics = metricsForCommandMonth_(text);
  const chartBlobs = dashboardChartBlobs_(metrics);
  if (!chartBlobs.length) {
    sendTelegramMessage_("Chua co du lieu chi tieu de ve bieu do.");
    return;
  }

  chartBlobs.forEach((item) => {
    sendTelegramPhoto_(item.blob, item.caption);
  });
}

function dashboardChartBlobs_(metrics) {
  const result = [];
  const categoryRows = sortedMapRows_(metrics.categoryTotals).filter((row) => Number(row[1] || 0) > 0);
  const counterpartyRows = topRows_(metrics.counterpartyTotals, 10).filter((row) => Number(row[1] || 0) > 0);
  const dailyRows = fullMonthDailyRows_(metrics.dailyTotals, metrics.month);

  if (categoryRows.length) {
    result.push({
      caption: `Chi tieu theo category - ${metrics.month}`,
      blob: buildPieChartBlob_(
        "Chi tieu theo category",
        "Category",
        "VND",
        categoryRows,
        `category-${metrics.month}.png`
      ),
    });
  }

  if (counterpartyRows.length) {
    result.push({
      caption: `Top noi nhan tien - ${metrics.month}`,
      blob: buildColumnChartBlob_(
        "Top noi nhan tien",
        "Counterparty",
        "VND",
        counterpartyRows,
        `counterparty-${metrics.month}.png`
      ),
    });
  }

  if (dailyRows.some((row) => Number(row[1] || 0) > 0)) {
    result.push({
      caption: `Chi tieu theo ngay - ${metrics.month}`,
      blob: buildLineChartBlob_(
        "Chi tieu theo ngay",
        "Ngay",
        "VND",
        dailyRows,
        `daily-${metrics.month}.png`
      ),
    });
  }

  return result;
}

function buildPieChartBlob_(title, labelHeader, valueHeader, rows, fileName) {
  const data = chartDataTable_(labelHeader, valueHeader, rows);
  return Charts.newPieChart()
    .setDataTable(data)
    .setTitle(title)
    .setDimensions(900, 520)
    .build()
    .getAs("image/png")
    .setName(fileName);
}

function buildColumnChartBlob_(title, labelHeader, valueHeader, rows, fileName) {
  const data = chartDataTable_(labelHeader, valueHeader, rows);
  return Charts.newColumnChart()
    .setDataTable(data)
    .setTitle(title)
    .setDimensions(900, 520)
    .build()
    .getAs("image/png")
    .setName(fileName);
}

function buildLineChartBlob_(title, labelHeader, valueHeader, rows, fileName) {
  const data = chartDataTable_(labelHeader, valueHeader, rows);
  return Charts.newLineChart()
    .setDataTable(data)
    .setTitle(title)
    .setDimensions(900, 520)
    .build()
    .getAs("image/png")
    .setName(fileName);
}

function chartDataTable_(labelHeader, valueHeader, rows) {
  const table = Charts.newDataTable()
    .addColumn(Charts.ColumnType.STRING, labelHeader)
    .addColumn(Charts.ColumnType.NUMBER, valueHeader);
  rows.forEach((row) => {
    table.addRow([String(row[0] || "Khong ro"), Number(row[1] || 0)]);
  });
  return table.build();
}

function chartToPngBlob_(chart, name) {
  try {
    return chart.getAs("image/png").setName(name);
  } catch (error) {
    return chart.getBlob().setName(name);
  }
}

function sendTelegramPhoto_(blob, caption) {
  const chatId = property_("TELEGRAM_CHAT_ID");
  const response = UrlFetchApp.fetch(telegramUrl_("sendPhoto"), {
    method: "post",
    payload: {
      chat_id: chatId,
      photo: blob,
      caption: caption || "",
    },
    muteHttpExceptions: true,
  });
  const json = JSON.parse(response.getContentText() || "{}");
  if (!json.ok) {
    sendTelegramMessage_(`Khong gui duoc bieu do: ${json.description || "loi Telegram khong ro"}`);
  }
}

function answerCallback_(callbackId, text) {
  UrlFetchApp.fetch(telegramUrl_("answerCallbackQuery"), {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({ callback_query_id: callbackId, text }),
    muteHttpExceptions: true,
  });
}

function editTelegramMessage_(chatId, messageId, text) {
  UrlFetchApp.fetch(telegramUrl_("editMessageText"), {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      text,
      disable_web_page_preview: true,
    }),
    muteHttpExceptions: true,
  });
}

function telegramUrl_(method) {
  return `https://api.telegram.org/bot${property_("TELEGRAM_BOT_TOKEN")}/${method}`;
}

function setTelegramMessageId_(transactionId, messageId) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(APP.transactionsSheet);
  const values = sheet.getDataRange().getValues();
  const col = columns_(values[0]);
  for (let i = 1; i < values.length; i++) {
    if (values[i][col.transaction_id] === transactionId) {
      sheet.getRange(i + 1, col.telegram_message_id + 1).setValue(messageId);
      return;
    }
  }
}

function formatTransactionMessage_(transaction) {
  return [
    "Giao dịch mới:",
    `${formatMoney_(transaction.amount)} - ${transaction.category}`,
    `${transaction.counterparty || "Không rõ đối tác"}`,
    `Nội dung: ${transaction.content || "(trống)"}`,
  ].join("\n");
}

function formatMoney_(amount) {
  return `${Number(amount || 0).toLocaleString("vi-VN")} VND`;
}

function getOrCreateSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }

  const lastColumn = Math.max(sheet.getLastColumn() || 1, 1);
  const existing = sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map((value) => String(value || "").trim());
  const hasAnyHeader = existing.some(Boolean);
  if (!hasAnyHeader) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    return sheet;
  }

  const missing = headers.filter((header) => existing.indexOf(header) < 0);
  if (missing.length) {
    sheet.getRange(1, sheet.getLastColumn() + 1, 1, missing.length).setValues([missing]);
  }
  return sheet;
}

function recreateSheet_(ss, name, headers) {
  const existing = ss.getSheetByName(name);
  if (existing) {
    const fallback = ss.getSheets().find((sheet) => sheet.getName() !== name);
    if (fallback) {
      ss.setActiveSheet(fallback);
    }
    ss.deleteSheet(existing);
  }

  const sheet = ss.insertSheet(name);
  if (headers && headers.length) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  return sheet;
}

function formatSheet_(sheet) {
  if (!sheet) {
    return;
  }
  const columns = Math.max(sheet.getLastColumn(), 1);
  sheet.getRange(1, 1, 1, columns).setBackground("#1f2937").setFontColor("#ffffff").setFontWeight("bold");
  sheet.setFrozenRows(1);
  for (let i = 1; i <= columns; i++) {
    sheet.autoResizeColumn(i);
  }
}

function objectsFromSheet_(sheet) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    return [];
  }
  const headers = values[0];
  return values
    .slice(1)
    .filter((row) => row.some((cell) => cell !== "" && cell !== null))
    .map((row) => rowToObject_(row, headers));
}

function rowToObject_(row, headers) {
  const sourceHeaders = headers || TRANSACTION_HEADERS;
  const object = {};
  sourceHeaders.forEach((header, index) => {
    object[header] = row[index];
  });
  return object;
}

function transactionToRow_(transaction) {
  return TRANSACTION_HEADERS.map((header) => {
    const value = transaction[header];
    if (value instanceof Date) {
      return Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
    }
    return value === undefined ? "" : value;
  });
}

function columns_(headers) {
  const result = {};
  headers.forEach((header, index) => {
    result[header] = index;
  });
  return result;
}

function existingValues_(sheet, header) {
  const values = sheet.getDataRange().getValues();
  const headers = values[0] || [];
  const index = headers.indexOf(header);
  const result = {};
  if (index < 0) {
    return result;
  }
  values.slice(1).forEach((row) => {
    if (row[index]) {
      result[row[index]] = true;
    }
  });
  return result;
}

function property_(key) {
  return PropertiesService.getScriptProperties().getProperty(key);
}

function setProperty_(key, value) {
  PropertiesService.getScriptProperties().setProperty(key, value);
}

function normalize_(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function trim_(value, limit) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text.slice(0, limit || 160).trim();
}

function maskSensitive_(value) {
  return String(value || "").replace(/\b\d{8,}\b/g, (match) => `****${match.slice(-4)}`);
}

function stripHtml_(html) {
  return String(html || "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ");
}

function escapeRegExp_(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function digest_(value) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value);
  return bytes.map((byte) => (byte + 256).toString(16).slice(-2)).join("");
}

function formatGmailDate_(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy/M/d");
}

function buildDashboardReply_(text) {
  const metrics = metricsForCommandMonth_(text);
  const lines = [
    `Dashboard ${metrics.month}`,
    `Thu nhập thật: ${formatMoney_(metrics.income)}`,
    `Chi tiêu sinh hoạt: ${formatMoney_(metrics.expense)}`,
    `Dòng tiền ròng: ${formatMoney_(metrics.income - metrics.expense)}`,
    `Tỷ lệ chi/thu: ${metrics.income ? Math.round((metrics.expense / metrics.income) * 1000) / 10 : 0}%`,
    `Giao dịch chi tiêu: ${metrics.includedSpendingCount}/${metrics.transactionCount}`,
    `Cần phân loại: ${metrics.needsReview}`,
  ];
  appendAiInsight_(lines, metrics, "dashboard");
  return lines.join("\n");
}

function buildReportReply_(text) {
  const metrics = metricsForCommandMonth_(text);
  const topCategory = sortedMapRows_(metrics.categoryTotals)[0] || ["Chưa có", 0];
  const topCounterparty = sortedMapRows_(metrics.counterpartyTotals)[0] || ["Chưa có", 0];
  return [
    `Báo cáo ${metrics.month}`,
    "",
    `Chi tiêu sinh hoạt: ${formatMoney_(metrics.expense)}`,
    `Thu nhập thật: ${formatMoney_(metrics.income)}`,
    `Dòng tiền ròng: ${formatMoney_(metrics.income - metrics.expense)}`,
    "",
    `Chi nhiều nhất theo category: ${topCategory[0]} - ${formatMoney_(topCategory[1])}`,
    `Chi nhiều nhất cho: ${topCounterparty[0]} - ${formatMoney_(topCounterparty[1])}`,
    "",
    `Vay nhận vào: ${formatMoney_(metrics.loanReceived)}`,
    `Trả nợ gốc: ${formatMoney_(metrics.loanPrincipalPaid)}`,
    `Cho vay: ${formatMoney_(metrics.loanGiven)}`,
    `Thu hồi cho vay: ${formatMoney_(metrics.loanCollected)}`,
    "",
    metrics.needsReview
      ? `Còn ${metrics.needsReview} giao dịch cần phân loại, nên số liệu vẫn là bản tạm.`
      : "Dữ liệu tháng này đã được phân loại hết.",
  ].join("\n");
}

function buildReportReplyWithInsight_(text) {
  const metrics = metricsForCommandMonth_(text);
  const lines = [buildReportReply_(text)];
  appendAiInsight_(lines, metrics, "report");
  return lines.join("\n");
}

function buildTopReply_(text) {
  const metrics = metricsForCommandMonth_(text);
  const categories = topRows_(metrics.categoryTotals, 5);
  const counterparties = topRows_(metrics.counterpartyTotals, 5);
  const lines = [`Top chi tiêu ${metrics.month}`, "", "Theo category:"];
  if (!categories.length) {
    lines.push("Chưa có dữ liệu.");
  } else {
    categories.forEach((row, index) => lines.push(`${index + 1}. ${row[0]}: ${formatMoney_(row[1])}`));
  }
  lines.push("", "Theo nơi nhận tiền:");
  if (!counterparties.length) {
    lines.push("Chưa có dữ liệu.");
  } else {
    counterparties.forEach((row, index) => lines.push(`${index + 1}. ${row[0]}: ${formatMoney_(row[1])}`));
  }
  return lines.join("\n");
}

function appendAiInsight_(lines, metrics, view) {
  const insight = buildAiInsightForMetrics_(metrics, view);
  if (!insight) {
    return;
  }
  lines.push("", "Nhận xét AI:", insight);
}

function buildAiInsightForMetrics_(metrics, view) {
  if (!property_("GEMINI_API_KEY")) {
    return "";
  }

  const summary = privacySafeMetricsSummary_(metrics);
  const prompt = [
    "Bạn là trợ lý phân tích tài chính cá nhân bằng tiếng Việt.",
    "Chỉ diễn giải từ số liệu tổng hợp được cung cấp, không bịa thêm giao dịch.",
    "Không đưa lời khuyên đầu tư, không kết luận y tế/pháp lý.",
    "Trả lời tự nhiên, ngắn gọn, tối đa 4 ý. Không dùng markdown bảng.",
    "Nếu thu nhập bằng 0, nói rõ có thể do chưa ghi nhận thu nhập trong dữ liệu.",
    `Kiểu câu trả lời: ${view}.`,
    `Số liệu tổng hợp JSON: ${JSON.stringify(summary)}`,
  ].join("\n");

  return trim_(generateGeminiText_(prompt, 520), 1200);
}

function privacySafeMetricsSummary_(metrics) {
  return {
    month: metrics.month,
    income: Number(metrics.income || 0),
    livingExpense: Number(metrics.expense || 0),
    netLivingCashflow: Number((metrics.income || 0) - (metrics.expense || 0)),
    expenseToIncomeRatio: metrics.income ? Math.round((metrics.expense / metrics.income) * 1000) / 10 : null,
    transactionCount: Number(metrics.transactionCount || 0),
    includedSpendingCount: Number(metrics.includedSpendingCount || 0),
    needsReview: Number(metrics.needsReview || 0),
    loanReceived: Number(metrics.loanReceived || 0),
    loanPrincipalPaid: Number(metrics.loanPrincipalPaid || 0),
    loanGiven: Number(metrics.loanGiven || 0),
    loanCollected: Number(metrics.loanCollected || 0),
    interestOrFee: Number(metrics.interestOrFee || 0),
    topCategories: topRows_(metrics.categoryTotals, 5).map((row) => ({
      category: row[0],
      amount: Number(row[1] || 0),
    })),
    topRecipients: topRows_(metrics.counterpartyTotals, 5).map((row, index) => ({
      label: `recipient_${index + 1}`,
      amount: Number(row[1] || 0),
    })),
    dailyPeak: dailyPeakFromMetrics_(metrics),
  };
}

function dailyPeakFromMetrics_(metrics) {
  const rows = sortedMapRows_(metrics.dailyTotals);
  if (!rows.length) {
    return { day: "", amount: 0 };
  }
  return { day: rows[0][0], amount: Number(rows[0][1] || 0) };
}

function buildDebtReply_() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(APP.debtSheet);
  if (!sheet || sheet.getLastRow() < 2) {
    forceRebuildDashboard_(ss);
  }

  const refreshed = ss.getSheetByName(APP.debtSheet);
  if (!refreshed || refreshed.getLastRow() < 2) {
    return "Debt Summary chưa có dữ liệu vay/nợ.";
  }

  const values = refreshed.getDataRange().getValues();
  const lines = ["Tình hình vay/nợ:"];
  values.slice(1, 8).forEach((row) => {
    const person = row[0] || "Không rõ";
    const youOwe = Number(row[5] || 0);
    const othersOwe = Number(row[6] || 0);
    if (youOwe || othersOwe) {
      lines.push(`${person}: bạn còn nợ ${formatMoney_(youOwe)}, người khác còn nợ bạn ${formatMoney_(othersOwe)}`);
    }
  });
  return lines.length > 1 ? lines.join("\n") : "Không thấy khoản vay/nợ còn mở trong dữ liệu hiện tại.";
}

function buildUncategorizedReply_() {
  const rows = forceRowsForDashboard_();
  const reviewRows = rows
    .filter((row) => String(row[7] || "").trim() === "needs_review" || String(row[9] || "").trim() === "needs_review")
    .slice(0, 10);
  if (!reviewRows.length) {
    return "Không còn giao dịch cần phân loại.";
  }

  const lines = [`Còn ${reviewRows.length} giao dịch cần phân loại gần nhất:`];
  reviewRows.forEach((row, index) => {
    lines.push(`${index + 1}. ${forceDayKey_(row[2])} - ${formatMoney_(forceNumber_(row[5]))} - ${String(row[10] || "Không rõ").slice(0, 60)}`);
  });
  lines.push("", "Các giao dịch cũ nên phân loại trực tiếp trong sheet Transactions để nhanh hơn.");
  return lines.join("\n");
}

function metricsForCommandMonth_(text) {
  const rows = forceRowsForDashboard_();
  const requestedMonth = requestedMonthFromText_(text);
  const currentMonth = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM");
  const month = requestedMonth || (wantsLatestMonth_(text) ? mostCommonMonth_(rows) || currentMonth : currentMonth);
  return forceMetricsFromRows_(rows, month);
}

function requestedMonthFromText_(text) {
  const raw = String(text || "");
  const isoMatch = raw.match(/\b\d{4}-\d{2}\b/);
  if (isoMatch) {
    return isoMatch[0];
  }

  const normalized = normalize_(raw);
  if (/\b(thang nay|month now|this month)\b/i.test(normalized)) {
    return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM");
  }
  if (/\b(thang truoc|last month|previous month)\b/i.test(normalized)) {
    return previousMonthKey_();
  }

  const monthMatch = normalized.match(/\bthang\s*(\d{1,2})(?:\s*(?:nam)?\s*(\d{4}))?/i);
  if (!monthMatch) {
    return "";
  }
  const month = Number(monthMatch[1]);
  if (month < 1 || month > 12) {
    return "";
  }
  const currentYear = Number(Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy"));
  const year = Number(monthMatch[2] || currentYear);
  return `${year}-${String(month).padStart(2, "0")}`;
}

function wantsLatestMonth_(text) {
  return /\b(last|latest|gan nhat|gần nhất|moi nhat|mới nhất)\b/i.test(String(text || ""));
}

function previousMonthKey_() {
  const now = new Date();
  const previous = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return Utilities.formatDate(previous, Session.getScriptTimeZone(), "yyyy-MM");
}

function forceRowsForDashboard_() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(APP.transactionsSheet);
  if (!sheet || sheet.getLastRow() < 2) {
    return [];
  }
  return sheet
    .getDataRange()
    .getValues()
    .slice(1)
    .filter((row) => row.some((cell) => cell !== "" && cell !== null));
}

function writeDiagnosticSheet_(ss, message) {
  const sheet = getOrCreateSheet_(ss, "Diagnostics", ["time", "message"]);
  sheet.clear();
  sheet.getRange(1, 1, 1, 2).setValues([["time", "message"]]);
  sheet.getRange(2, 1, 1, 2).setValues([[new Date(), message]]);
  sheet.getRange(2, 2).setWrap(true);
  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(2, 760);
  formatSheet_(sheet);
}

function forceRebuildDashboard_(ss, requestedMonth) {
  const transactions = ss.getSheetByName(APP.transactionsSheet);
  if (!transactions || transactions.getLastRow() < 2) {
    writeEmptyDashboard_(ss, "Transactions chưa có dữ liệu.");
    return;
  }

  const values = transactions.getDataRange().getValues();
  const rows = values.slice(1).filter((row) => row.some((cell) => cell !== "" && cell !== null));
  if (!rows.length) {
    writeEmptyDashboard_(ss, "Transactions chưa có dòng giao dịch thật.");
    return;
  }

  let targetMonth = requestedMonth || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM");
  let metrics = forceMetricsFromRows_(rows, targetMonth);
  if (!requestedMonth && metrics.transactionCount === 0) {
    targetMonth = mostCommonMonth_(rows) || targetMonth;
    metrics = forceMetricsFromRows_(rows, targetMonth);
  }

  const dashboard = recreateSheet_(ss, APP.dashboardSheet, ["section", "value"]);

  dashboard.getRange("A1").setValue(`Dashboard chi tiêu ${targetMonth}`);
  dashboard.getRange("A1").setFontSize(16).setFontWeight("bold");

  const kpiRows = [
    ["Chỉ số", "Giá trị"],
    ["Tổng dòng Transactions đọc được", rows.length],
    ["Dòng thuộc tháng dashboard", metrics.transactionCount],
    ["Dòng được tính chi tiêu", metrics.includedSpendingCount],
    ["Thu nhập thật", metrics.income],
    ["Chi tiêu sinh hoạt", metrics.expense],
    ["Dòng tiền sinh hoạt ròng", metrics.income - metrics.expense],
    ["Tỷ lệ chi/thu", metrics.income ? metrics.expense / metrics.income : 0],
    ["Cần phân loại", metrics.needsReview],
    ["Vay nhận vào", metrics.loanReceived],
    ["Trả nợ gốc", metrics.loanPrincipalPaid],
    ["Cho vay", metrics.loanGiven],
    ["Thu hồi cho vay", metrics.loanCollected],
    ["Lãi/phí vay", metrics.interestOrFee],
  ];
  writeTable_(dashboard, 3, 1, kpiRows);

  const categoryRows = [["Category", "Chi tiêu"]].concat(sortedMapRows_(metrics.categoryTotals));
  writeTable_(dashboard, 3, 4, categoryRows.length > 1 ? categoryRows : [["Category", "Chi tiêu"], ["Chưa có dữ liệu", 0]]);

  const counterpartyRows = [["Counterparty", "Chi tiêu"]].concat(topRows_(metrics.counterpartyTotals, 10));
  writeTable_(dashboard, 20, 1, counterpartyRows.length > 1 ? counterpartyRows : [["Counterparty", "Chi tiêu"], ["Chưa có dữ liệu", 0]]);

  const dailyRows = [["Ngày", "Chi tiêu"]].concat(fullMonthDailyRows_(metrics.dailyTotals, targetMonth));
  writeTable_(dashboard, 20, 4, dailyRows.length > 1 ? dailyRows : [["Ngày", "Chi tiêu"], ["Chưa có dữ liệu", 0]]);

  const reviewRows = [["Ngày", "Số tiền", "Đối tác", "Nội dung"]].concat(metrics.reviewRows.slice(0, 20));
  writeTable_(
    dashboard,
    36,
    1,
    reviewRows.length > 1 ? reviewRows : [["Ngày", "Số tiền", "Đối tác", "Nội dung"], ["", 0, "Không còn giao dịch cần phân loại", ""]]
  );

  dashboard.getRange(7, 2, 3, 1).setNumberFormat('#,##0 "VND"');
  dashboard.getRange(12, 2, 5, 1).setNumberFormat('#,##0 "VND"');
  dashboard.getRange(10, 2).setNumberFormat("0.0%");
  dashboard.getRange(3, 5, Math.max(categoryRows.length, 2), 1).setNumberFormat('#,##0 "VND"');
  dashboard.getRange(20, 2, Math.max(counterpartyRows.length, 2), 1).setNumberFormat('#,##0 "VND"');
  dashboard.getRange(20, 5, Math.max(dailyRows.length, 2), 1).setNumberFormat('#,##0 "VND"');
  dashboard.getRange(36, 2, Math.max(reviewRows.length, 2), 1).setNumberFormat('#,##0 "VND"');
  formatForceDashboard_(dashboard);
  insertForceDashboardCharts_(dashboard, categoryRows, counterpartyRows, dailyRows);
  refreshReportFromForceMetrics_(ss, metrics);
}

function forceMetricsFromRows_(rows, targetMonth) {
  const metrics = {
    month: targetMonth,
    transactionCount: 0,
    includedSpendingCount: 0,
    income: 0,
    expense: 0,
    loanReceived: 0,
    loanPrincipalPaid: 0,
    loanGiven: 0,
    loanCollected: 0,
    interestOrFee: 0,
    needsReview: 0,
    categoryTotals: {},
    counterpartyTotals: {},
    dailyTotals: {},
    reviewRows: [],
  };

  rows.forEach((row) => {
    const month = forceMonthKey_(row[3], row[2]);
    if (month !== targetMonth) {
      return;
    }

    metrics.transactionCount += 1;
    const amount = forceNumber_(row[5]);
    const category = String(row[6] || "Khác").trim() || "Khác";
    const reviewStatus = String(row[7] || "").trim();
    const includeInSpending = forceBool_(row[8]);
    const cashflowType = String(row[9] || "").trim();
    const counterparty = String(row[10] || "Không rõ").trim() || "Không rõ";
    const content = String(row[11] || "").trim();
    const principal = forceNumber_(row[13]) || amount;
    const interest = forceNumber_(row[14]);
    const day = forceDayKey_(row[2]);

    if (reviewStatus === "needs_review" || cashflowType === "needs_review") {
      metrics.needsReview += 1;
      metrics.reviewRows.push([day, amount, counterparty, content]);
    }
    if (cashflowType === "income") {
      metrics.income += amount;
    }
    if (includeInSpending) {
      metrics.includedSpendingCount += 1;
      const personalSpend = spendingAmountFromArray_(row, columns_(TRANSACTION_HEADERS));
      metrics.expense += personalSpend;
      addToMap_(metrics.categoryTotals, category, personalSpend);
      addToMap_(metrics.counterpartyTotals, counterparty, personalSpend);
      addToMap_(metrics.dailyTotals, day, personalSpend);
    }
    if (cashflowType === "loan_in") {
      metrics.loanReceived += amount;
    }
    if (cashflowType === "loan_repayment") {
      metrics.loanPrincipalPaid += principal;
      metrics.interestOrFee += interest;
      if (interest > 0) {
        metrics.expense += interest;
        addToMap_(metrics.categoryTotals, "Chi phí tài chính", interest);
        addToMap_(metrics.counterpartyTotals, counterparty, interest);
        addToMap_(metrics.dailyTotals, day, interest);
      }
    }
    if (cashflowType === "loan_out") {
      metrics.loanGiven += amount;
    }
    if (cashflowType === "loan_collection") {
      metrics.loanCollected += amount;
    }
    if (cashflowType === "financial_cost") {
      metrics.interestOrFee += amount;
    }
  });

  return metrics;
}

function mostCommonMonth_(rows) {
  const counts = {};
  rows.forEach((row) => {
    const month = forceMonthKey_(row[3], row[2]);
    if (month) {
      counts[month] = (counts[month] || 0) + 1;
    }
  });
  return Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] || "";
}

function forceMonthKey_(monthValue, occurredAtValue) {
  if (monthValue instanceof Date) {
    return Utilities.formatDate(monthValue, Session.getScriptTimeZone(), "yyyy-MM");
  }
  const monthText = String(monthValue || "").trim();
  const monthMatch = monthText.match(/\d{4}-\d{2}/);
  if (monthMatch) {
    return monthMatch[0];
  }

  if (occurredAtValue instanceof Date) {
    return Utilities.formatDate(occurredAtValue, Session.getScriptTimeZone(), "yyyy-MM");
  }
  const occurredText = String(occurredAtValue || "").trim();
  const occurredMatch = occurredText.match(/\d{4}-\d{2}/);
  return occurredMatch ? occurredMatch[0] : "";
}

function forceDayKey_(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  const text = String(value || "").trim();
  const match = text.match(/\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : text.slice(0, 10) || "Không rõ";
}

function forceNumber_(value) {
  if (typeof value === "number") {
    return value;
  }
  const cleaned = String(value || "").replace(/[^\d.-]/g, "");
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : 0;
}

function forceBool_(value) {
  if (value === true) {
    return true;
  }
  return String(value || "").trim().toLowerCase() === "true";
}

function spendingAmountFromObject_(row) {
  const amount = Number(row.amount || 0);
  const personalAmount = Number(row.personal_amount || 0);
  return personalAmount > 0 ? personalAmount : amount;
}

function spendingAmountFromArray_(row, col) {
  const amount = forceNumber_(row[col.amount]);
  const personalIndex = col.personal_amount;
  const personalAmount = personalIndex === undefined ? 0 : forceNumber_(row[personalIndex]);
  return personalAmount > 0 ? personalAmount : amount;
}

function reimbursableAmountFromObject_(row) {
  const amount = Number(row.amount || 0);
  const personalAmount = Number(row.personal_amount || 0);
  return personalAmount > 0 ? Math.max(amount - personalAmount, 0) : 0;
}

function writeEmptyDashboard_(ss, reason) {
  const dashboard = recreateSheet_(ss, APP.dashboardSheet, ["section", "value"]);
  dashboard.getRange(1, 1, 2, 2).setValues([
    ["Dashboard", "Không có dữ liệu"],
    ["Lý do", reason],
  ]);
  formatSheet_(dashboard);
}

function refreshReportFromForceMetrics_(ss, metrics) {
  const report = getOrCreateSheet_(ss, APP.reportSheet, ["section", "content"]);
  report.clear();
  const topCategory = sortedMapRows_(metrics.categoryTotals)[0] || ["Chưa có", 0];
  const topCounterparty = sortedMapRows_(metrics.counterpartyTotals)[0] || ["Chưa có", 0];
  const rows = [
    ["section", "content"],
    ["Báo cáo tháng", metrics.month],
    ["Tổng quan", `Thu nhập thật: ${formatMoney_(metrics.income)}\nChi tiêu sinh hoạt: ${formatMoney_(metrics.expense)}\nDòng tiền sinh hoạt ròng: ${formatMoney_(metrics.income - metrics.expense)}`],
    ["Điểm nổi bật", `Category chi nhiều nhất: ${topCategory[0]} (${formatMoney_(topCategory[1])})\nĐối tác chi nhiều nhất: ${topCounterparty[0]} (${formatMoney_(topCounterparty[1])})`],
    ["Khoản vay/nợ", `Vay nhận vào: ${formatMoney_(metrics.loanReceived)}\nTrả nợ gốc: ${formatMoney_(metrics.loanPrincipalPaid)}\nCho vay: ${formatMoney_(metrics.loanGiven)}\nThu hồi cho vay: ${formatMoney_(metrics.loanCollected)}`],
    ["Chất lượng dữ liệu", metrics.needsReview ? `Còn ${metrics.needsReview} giao dịch cần phân loại.` : "Không còn giao dịch cần phân loại trong tháng."],
  ];
  writeTable_(report, 1, 1, rows);
  report.getRange(1, 1, 1, 2).setBackground("#1f2937").setFontColor("#ffffff").setFontWeight("bold");
  report.getRange(2, 2, rows.length - 1, 1).setWrap(true);
  report.setColumnWidth(1, 180);
  report.setColumnWidth(2, 620);
}

function formatForceDashboard_(dashboard) {
  dashboard.setFrozenRows(2);
  ["A3:B3", "D3:E3", "A20:B20", "D20:E20", "A36:D36"].forEach((range) => {
    dashboard.getRange(range).setBackground("#1f2937").setFontColor("#ffffff").setFontWeight("bold");
  });
  [1, 4].forEach((col) => dashboard.setColumnWidth(col, 180));
  [2, 5].forEach((col) => dashboard.setColumnWidth(col, 150));
  dashboard.setColumnWidth(3, 24);
  dashboard.setColumnWidth(6, 24);
  dashboard.setColumnWidth(7, 420);
  dashboard.setColumnWidth(8, 420);
}

function insertForceDashboardCharts_(dashboard, categoryRows, counterpartyRows, dailyRows) {
  if (categoryRows.length > 1) {
    dashboard.insertChart(
      dashboard
        .newChart()
        .setChartType(Charts.ChartType.PIE)
        .addRange(dashboard.getRange(3, 4, categoryRows.length, 2))
        .setPosition(3, 7, 0, 0)
        .setOption("width", 720)
        .setOption("height", 360)
        .setOption("title", "Chi tiêu theo category")
        .build()
    );
  }
  if (counterpartyRows.length > 1) {
    dashboard.insertChart(
      dashboard
        .newChart()
        .setChartType(Charts.ChartType.COLUMN)
        .addRange(dashboard.getRange(20, 1, counterpartyRows.length, 2))
        .setPosition(20, 7, 0, 0)
        .setOption("width", 720)
        .setOption("height", 360)
        .setOption("title", "Top nơi nhận tiền")
        .build()
    );
  }
  if (dailyRows.length > 1) {
    dashboard.insertChart(
      dashboard
        .newChart()
        .setChartType(Charts.ChartType.LINE)
        .addRange(dashboard.getRange(20, 4, dailyRows.length, 2))
        .setPosition(36, 7, 0, 0)
        .setOption("width", 720)
        .setOption("height", 360)
        .setOption("title", "Chi tiêu theo ngày")
        .setOption("pointSize", 5)
        .setOption("legend", { position: "none" })
        .setOption("interpolateNulls", false)
        .build()
    );
  }
}

function refreshAdvancedDashboard_(ss, rows) {
  const dashboard = recreateSheet_(ss, APP.dashboardSheet, ["section", "value"]);

  const currentMonth = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM");
  const monthRows = rows.filter((row) => row.month === currentMonth);
  const metrics = buildMonthMetrics_(monthRows, currentMonth);

  dashboard.getRange("A1").setValue(`Dashboard chi tiêu ${currentMonth}`);
  dashboard.getRange("A1").setFontSize(16).setFontWeight("bold");

  const kpiRows = [
    ["Chỉ số", "Giá trị"],
    ["Thu nhập thật", metrics.income],
    ["Chi tiêu sinh hoạt", metrics.expense],
    ["Dòng tiền sinh hoạt ròng", metrics.income - metrics.expense],
    ["Tỷ lệ chi/thu", metrics.income ? metrics.expense / metrics.income : 0],
    ["Số giao dịch", metrics.transactionCount],
    ["Cần phân loại", metrics.needsReview],
    ["Vay nhận vào", metrics.loanReceived],
    ["Trả nợ gốc", metrics.loanPrincipalPaid],
    ["Cho vay", metrics.loanGiven],
    ["Thu hồi cho vay", metrics.loanCollected],
    ["Lãi/phí vay", metrics.interestOrFee],
  ];
  writeTable_(dashboard, 3, 1, kpiRows);

  const categoryRows = [["Category", "Chi tiêu"]].concat(sortedMapRows_(metrics.categoryTotals));
  writeTable_(dashboard, 3, 4, categoryRows.length > 1 ? categoryRows : [["Category", "Chi tiêu"], ["Chưa có dữ liệu", 0]]);

  const counterpartyRows = [["Counterparty", "Chi tiêu"]].concat(topRows_(metrics.counterpartyTotals, 10));
  writeTable_(dashboard, 18, 1, counterpartyRows.length > 1 ? counterpartyRows : [["Counterparty", "Chi tiêu"], ["Chưa có dữ liệu", 0]]);

  const dailyRows = [["Ngày", "Chi tiêu"]].concat(fullMonthDailyRows_(metrics.dailyTotals, currentMonth));
  writeTable_(dashboard, 18, 4, dailyRows.length > 1 ? dailyRows : [["Ngày", "Chi tiêu"], ["Chưa có dữ liệu", 0]]);

  const reviewRows = [["Ngày", "Số tiền", "Đối tác", "Nội dung"]].concat(
    metrics.reviewRows.slice(0, 20).map((row) => [
      String(row.occurred_at || "").slice(0, 10),
      Number(row.amount || 0),
      row.counterparty || "",
      row.content || "",
    ])
  );
  writeTable_(
    dashboard,
    34,
    1,
    reviewRows.length > 1 ? reviewRows : [["Ngày", "Số tiền", "Đối tác", "Nội dung"], ["", 0, "Không còn giao dịch cần phân loại", ""]]
  );

  dashboard.getRange(4, 2, 3, 1).setNumberFormat('#,##0 "VND"');
  dashboard.getRange(10, 2, 4, 1).setNumberFormat('#,##0 "VND"');
  dashboard.getRange(7, 2).setNumberFormat("0.0%");
  dashboard.getRange(3, 5, Math.max(categoryRows.length, 2), 1).setNumberFormat('#,##0 "VND"');
  dashboard.getRange(18, 2, Math.max(counterpartyRows.length, 2), 1).setNumberFormat('#,##0 "VND"');
  dashboard.getRange(18, 5, Math.max(dailyRows.length, 2), 1).setNumberFormat('#,##0 "VND"');
  dashboard.getRange(34, 2, Math.max(reviewRows.length, 2), 1).setNumberFormat('#,##0 "VND"');

  formatAdvancedDashboard_(dashboard);
  insertAdvancedDashboardCharts_(dashboard, categoryRows, counterpartyRows, dailyRows);
  refreshReportSheet_(ss, metrics);
}

function buildMonthMetrics_(monthRows, currentMonth) {
  const metrics = {
    month: currentMonth,
    transactionCount: monthRows.length,
    income: 0,
    expense: 0,
    loanReceived: 0,
    loanPrincipalPaid: 0,
    loanGiven: 0,
    loanCollected: 0,
    interestOrFee: 0,
    needsReview: 0,
    categoryTotals: {},
    counterpartyTotals: {},
    dailyTotals: {},
    reviewRows: [],
  };

  monthRows.forEach((row) => accumulateMonthRow_(metrics, row));
  return metrics;
}

function accumulateMonthRow_(metrics, row) {
  const amount = Number(row.amount || 0);
  const interest = Number(row.interest_amount || 0);
  const cashflowType = row.cashflow_type || "";
  const day = dayKey_(row.occurred_at);

  if (row.review_status === "needs_review") {
    metrics.needsReview += 1;
    metrics.reviewRows.push(row);
  }
  if (cashflowType === "income") {
    metrics.income += amount;
  }
  if (String(row.include_in_spending).toLowerCase() === "true") {
    const personalSpend = spendingAmountFromObject_(row);
    metrics.expense += personalSpend;
    addToMap_(metrics.categoryTotals, row.category || "Khác", personalSpend);
    addToMap_(metrics.counterpartyTotals, row.counterparty || "Không rõ", personalSpend);
    addToMap_(metrics.dailyTotals, day, personalSpend);
  }
  if (cashflowType === "loan_in") {
    metrics.loanReceived += amount;
  }
  if (cashflowType === "loan_repayment") {
    metrics.loanPrincipalPaid += Number(row.principal_amount || amount);
    metrics.interestOrFee += interest;
    if (interest > 0) {
      metrics.expense += interest;
      addToMap_(metrics.categoryTotals, "Chi phí tài chính", interest);
      addToMap_(metrics.counterpartyTotals, row.counterparty || "Không rõ", interest);
      addToMap_(metrics.dailyTotals, day, interest);
    }
  }
  if (cashflowType === "loan_out") {
    metrics.loanGiven += amount;
  }
  if (cashflowType === "loan_collection") {
    metrics.loanCollected += amount;
  }
  if (cashflowType === "financial_cost") {
    metrics.interestOrFee += amount;
  }
}

function refreshReportSheet_(ss, metrics) {
  const report = getOrCreateSheet_(ss, APP.reportSheet, ["section", "content"]);
  report.clear();

  const topCategory = sortedMapRows_(metrics.categoryTotals)[0] || ["Chưa có", 0];
  const topCounterparty = sortedMapRows_(metrics.counterpartyTotals)[0] || ["Chưa có", 0];
  const reviewNote =
    metrics.needsReview > 0
      ? `Còn ${metrics.needsReview} giao dịch cần phân loại, nên dashboard hiện vẫn là bản tạm.`
      : "Không còn giao dịch cần phân loại trong tháng.";
  const debtNote = [
    `Vay nhận vào: ${formatMoney_(metrics.loanReceived)}`,
    `Trả nợ gốc: ${formatMoney_(metrics.loanPrincipalPaid)}`,
    `Cho vay: ${formatMoney_(metrics.loanGiven)}`,
    `Thu hồi cho vay: ${formatMoney_(metrics.loanCollected)}`,
  ].join("\n");

  const rows = [
    ["Báo cáo tháng", metrics.month],
    ["Tổng quan", `Thu nhập thật: ${formatMoney_(metrics.income)}\nChi tiêu sinh hoạt: ${formatMoney_(metrics.expense)}\nDòng tiền sinh hoạt ròng: ${formatMoney_(metrics.income - metrics.expense)}`],
    ["Điểm nổi bật", `Category chi nhiều nhất: ${topCategory[0]} (${formatMoney_(topCategory[1])})\nĐối tác chi nhiều nhất: ${topCounterparty[0]} (${formatMoney_(topCounterparty[1])})`],
    ["Khoản vay/nợ", debtNote],
    ["Chất lượng dữ liệu", reviewNote],
    ["Gợi ý hành động", buildActionSuggestion_(metrics, topCategory)],
  ];

  writeTable_(report, 1, 1, [["section", "content"]].concat(rows));
  report.getRange(1, 1, 1, 2).setBackground("#1f2937").setFontColor("#ffffff").setFontWeight("bold");
  report.getRange(2, 2, rows.length, 1).setWrap(true);
  report.setColumnWidth(1, 180);
  report.setColumnWidth(2, 620);
}

function buildActionSuggestion_(metrics, topCategory) {
  const suggestions = [];
  if (metrics.needsReview > 0) {
    suggestions.push("Phân loại trước các giao dịch giá trị lớn hoặc nội dung dễ nhớ.");
  }
  if (metrics.income > 0 && metrics.expense / metrics.income > 0.8) {
    suggestions.push("Tỷ lệ chi/thu đang cao, nên kiểm tra 2-3 category lớn nhất.");
  }
  if (topCategory[1] > 0) {
    suggestions.push(`Xem lại nhóm ${topCategory[0]} vì đây là khoản chi lớn nhất tháng.`);
  }
  if (metrics.loanReceived || metrics.loanPrincipalPaid || metrics.loanGiven || metrics.loanCollected) {
    suggestions.push("Kiểm tra Debt Summary để đảm bảo tiền vay/trả nợ không bị tính vào chi tiêu sinh hoạt.");
  }
  return suggestions.length ? suggestions.join("\n") : "Dữ liệu tháng này khá gọn. Tiếp tục dùng keyword khi chuyển khoản để bot tự phân loại tốt hơn.";
}

function insertAdvancedDashboardCharts_(dashboard, categoryRows, counterpartyRows, dailyRows) {
  if (categoryRows.length > 1) {
    dashboard.insertChart(
      dashboard
        .newChart()
        .setChartType(Charts.ChartType.PIE)
        .addRange(dashboard.getRange(3, 4, categoryRows.length, 2))
        .setPosition(3, 7, 0, 0)
        .setOption("width", 720)
        .setOption("height", 360)
        .setOption("title", "Chi tiêu theo category")
        .build()
    );
  }
  if (counterpartyRows.length > 1) {
    dashboard.insertChart(
      dashboard
        .newChart()
        .setChartType(Charts.ChartType.COLUMN)
        .addRange(dashboard.getRange(18, 1, counterpartyRows.length, 2))
        .setPosition(18, 7, 0, 0)
        .setOption("width", 720)
        .setOption("height", 360)
        .setOption("title", "Top nơi nhận tiền")
        .build()
    );
  }
  if (dailyRows.length > 1) {
    dashboard.insertChart(
      dashboard
        .newChart()
        .setChartType(Charts.ChartType.LINE)
        .addRange(dashboard.getRange(18, 4, dailyRows.length, 2))
        .setPosition(34, 7, 0, 0)
        .setOption("width", 720)
        .setOption("height", 360)
        .setOption("title", "Chi tiêu theo ngày")
        .setOption("pointSize", 5)
        .setOption("legend", { position: "none" })
        .setOption("interpolateNulls", false)
        .build()
    );
  }
}

function formatAdvancedDashboard_(dashboard) {
  dashboard.setFrozenRows(2);
  dashboard.getRange("A3:B3").setBackground("#1f2937").setFontColor("#ffffff").setFontWeight("bold");
  dashboard.getRange("D3:E3").setBackground("#1f2937").setFontColor("#ffffff").setFontWeight("bold");
  dashboard.getRange("A18:B18").setBackground("#1f2937").setFontColor("#ffffff").setFontWeight("bold");
  dashboard.getRange("D18:E18").setBackground("#1f2937").setFontColor("#ffffff").setFontWeight("bold");
  dashboard.getRange("A34:D34").setBackground("#1f2937").setFontColor("#ffffff").setFontWeight("bold");
  [1, 4].forEach((col) => dashboard.setColumnWidth(col, 180));
  [2, 5].forEach((col) => dashboard.setColumnWidth(col, 150));
  dashboard.setColumnWidth(3, 24);
  dashboard.setColumnWidth(6, 24);
  dashboard.setColumnWidth(7, 420);
  dashboard.setColumnWidth(8, 420);
}

function writeTable_(sheet, row, col, values) {
  if (!values.length) {
    return;
  }
  sheet.getRange(row, col, values.length, values[0].length).setValues(values);
}

function sortedMapRows_(map) {
  return Object.keys(map)
    .sort((a, b) => map[b] - map[a])
    .map((key) => [key, map[key]]);
}

function topRows_(map, limit) {
  return sortedMapRows_(map).slice(0, limit);
}

function fullMonthDailyRows_(map, monthKey) {
  const match = String(monthKey || "").match(/^(\d{4})-(\d{2})$/);
  if (!match) {
    return sortedMapRows_(map);
  }

  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const rows = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, monthIndex, day);
    const key = Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd");
    rows.push([key, map[key] || 0]);
  }
  return rows;
}

function addToMap_(map, key, amount) {
  map[key] = (map[key] || 0) + amount;
}

function dayKey_(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  return String(value || "").slice(0, 10) || "Không rõ";
}

function monthKeyFromRow_(row) {
  const month = row.month;
  if (month instanceof Date) {
    return Utilities.formatDate(month, Session.getScriptTimeZone(), "yyyy-MM");
  }

  const monthText = String(month || "").trim();
  const monthMatch = monthText.match(/\d{4}-\d{2}/);
  if (monthMatch) {
    return monthMatch[0];
  }

  const occurredAt = row.occurred_at;
  if (occurredAt instanceof Date) {
    return Utilities.formatDate(occurredAt, Session.getScriptTimeZone(), "yyyy-MM");
  }

  const occurredText = String(occurredAt || "").trim();
  const occurredMatch = occurredText.match(/\d{4}-\d{2}/);
  return occurredMatch ? occurredMatch[0] : "";
}
