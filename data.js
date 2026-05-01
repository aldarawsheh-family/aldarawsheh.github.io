// data.js - بيانات شجرة الدرواشة كاملة
var LOCAL_DATA = {
  name: "عليان",
  birth: "1200",
  status: "متوفى رحمه الله",
  color: "#8B5A2B", // لون بني ترابي للجد الأعلى
  isRoot: true,
  branchCode: "Z",
  customShape: "default",
  familyColor: "",
  children: [
    {
      name: "هزيم العليان",
      birth: "1230",
      status: "متوفى رحمه الله",
      color: "#8B5A2B",
      branchCode: "Z",
      customShape: "default",
      familyColor: "",
      children: [
        {
          name: "عطشان الهزيم",
          birth: "1260",
          status: "متوفى رحمه الله",
          color: "#8B5A2B",
          branchCode: "Z",
          customShape: "default",
          familyColor: "",
          children: [
            {
              // درويش - المحور الرئيسي الذي سيبني عليه كل شيء
              name: "درويش العلياني",
              birth: "1280",
              status: "متوفى رحمه الله",
              color: "color-root", // سيأخذ اللون الذهبي كجذر فرعي
              branchCode: "D",
              customShape: "default",
              familyColor: "",
              children: [
                {
                  name: "خليف الدرويش",
                  birth: "1320",
                  status: "متوفى رحمه الله",
                  color: "color-khulaif",
                  branchCode: "H",
                  customShape: "default",
                  familyColor: "",
                  children: [
                    {
                      name: "محمد الخليف",
                      birth: "1360",
                      status: "متوفى رحمه الله",
                      branchCode: "H",
                      customShape: "default",
                      familyColor: "",
                      children: [
                        {
                          name: "ذياب المحمد",
                          birth: "1390",
                          status: "حي أطال الله بعمره",
                          branchCode: "H",
                          customShape: "default",
                          familyColor: "",
                          children: [
                            { name: "محمد الذياب", birth: "1420", status: "حي أطال الله بعمره", branchCode: "H", customShape: "default", familyColor: "" },
                            { name: "أحمد الذياب", birth: "1425", status: "حي أطال الله بعمره", branchCode: "H", customShape: "default", familyColor: "" },
                            { name: "خالد الذياب", birth: "1430", status: "حي أطال الله بعمره", branchCode: "H", customShape: "default", familyColor: "" },
                            { name: "سيار الذياب", birth: "1435", status: "حي أطال الله بعمره", branchCode: "H", customShape: "default", familyColor: "" }
                          ]
                        }
                      ]
                    },
                    { name: "حميد الخليف", birth: "1365", status: "متوفى رحمه الله", branchCode: "H", customShape: "default", familyColor: "" },
                    { name: "سليمه الخليف", birth: "1370", status: "متوفاه رحمها الله", branchCode: "H", customShape: "default", familyColor: "" }
                  ]
                },
                {
                  name: "علوش الدرويش",
                  birth: "1330",
                  status: "متوفى رحمه الله",
                  color: "color-aloosh",
                  branchCode: "A",
                  customShape: "default",
                  familyColor: "",
                  children: []
                },
                {
                  name: "محيميد الدرويش",
                  birth: "1335",
                  status: "متوفى رحمه الله",
                  color: "color-hamid",
                  branchCode: "M",
                  customShape: "default",
                  familyColor: "",
                  children: []
                },
                {
                  name: "حميدو الدرويش",
                  birth: "1340",
                  status: "متوفى رحمه الله",
                  color: "color-hamido",
                  branchCode: "E",
                  customShape: "default",
                  familyColor: "",
                  children: []
                }
              ]
            }
          ]
        },
        {
          name: "هملان الهزيم",
          birth: "1265",
          status: "متوفى رحمه الله",
          color: "#8B5A2B",
          branchCode: "Z",
          customShape: "default",
          familyColor: "",
          children: [
            {
              name: "عبلان الهملان",
              birth: "1290",
              status: "متوفى رحمه الله",
              branchCode: "Z",
              customShape: "default",
              familyColor: ""
            }
          ]
        }
      ]
    }
  ]
};