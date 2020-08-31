export const makeSetRocCurves = (metrics) => {
    try {
      const chartColors = ['#5603ad', '#00f2c3', '#f5365c', '#2dce89', '#e14eca', '#ffd600', '#ff8d72', '#2dce4b']
      var legend = metrics.map(val => { return val.ALG + ' - AUC: ' + val.ROC.auc });
      var curves = metrics.map(val => { return val.ROC });
      var curvesPoints = []
      for (let i = 0; i < curves.length; i++) {
        var points = []
        for (let j = 0; j < curves[i].x.length; j++) {
          points.push({ 'x': curves[i].x[j], 'y': curves[i].y[j] })
        }
        curvesPoints.push(
          {
            "id": legend[i],
            "color": chartColors[i],
            "data": points,
          })
      }
      return curvesPoints;

    } catch (error) {
      return error;
    }
  }