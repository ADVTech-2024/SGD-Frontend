import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';

Chart.register(...registerables);

interface DemandaSummary {
  total: number;
  concluidas: number;
  emAndamento: number;
  pendentes: number;
}

interface KPIs {
  tempoMedioResolucao: number;
  percentualConcluidas: string;
  demandasPorDia: number;
  slaAtendidos: number;
  taxaReabertura: number;
}

interface Alerta {
  tipo: string;
  quantidade: number;
  severidade: 'alta' | 'media' | 'baixa';
}

interface DepartmentData {
  name: string;
  value: number;
}

interface PriorityData {
  name: string;
  value: number;
}

interface TimeSeriesData {
  name: string;
  concluidas: number;
  emAndamento: number;
  pendentes: number;
}

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    MatProgressBarModule,
    MatDividerModule,
    MatBadgeModule
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {
  demandaSummary: DemandaSummary = {
    total: 0,
    concluidas: 0,
    emAndamento: 0,
    pendentes: 0
  };

  kpis: KPIs = {
    tempoMedioResolucao: 0,
    percentualConcluidas: '0',
    demandasPorDia: 0,
    slaAtendidos: 0,
    taxaReabertura: 0
  };

  alertas: Alerta[] = [];
  departmentData: DepartmentData[] = [];
  priorityData: PriorityData[] = [];
  timeSeriesData: TimeSeriesData[] = [];

  filtroSelecionado: string = 'todos';
  periodoSelecionado: string = 'mes';

  chartColors = {
    concluidas: 'rgba(76, 175, 80, 0.7)',
    emAndamento: 'rgba(255, 205, 86, 0.7)',
    pendentes: 'rgba(255, 99, 132, 0.7)',
    borderConcluidas: 'rgba(76, 175, 80, 1)',
    borderEmAndamento: 'rgba(255, 205, 86, 1)',
    borderPendentes: 'rgba(255, 99, 132, 1)'
  };

  constructor() { }

  ngOnInit(): void {
    this.carregarDadosMock();

    setTimeout(() => {
      this.renderizarGraficoPizza();
      this.renderizarGraficoBarras();
      this.renderizarGraficoLinha();
      this.renderizarGraficoDepartamentos();
      this.renderizarGraficoPrioridades();
    }, 0);
  }

  carregarDadosMock(): void {
    this.demandaSummary = {
      total: 120,
      concluidas: 25,
      emAndamento: 55,
      pendentes: 40
    };

    this.kpis = {
      tempoMedioResolucao: 3.2,
      percentualConcluidas: ((this.demandaSummary.concluidas / this.demandaSummary.total) * 100).toFixed(1),
      demandasPorDia: 8.5,
      slaAtendidos: 87,
      taxaReabertura: 12
    };

    this.alertas = [
      { tipo: 'Atraso', quantidade: 12, severidade: 'alta' },
      { tipo: 'Ociosidade', quantidade: 8, severidade: 'media' },
      { tipo: 'Não Conformidade', quantidade: 5, severidade: 'baixa' }
    ];

    this.departmentData = [
      { name: 'TI', value: 45 },
      { name: 'RH', value: 28 },
      { name: 'Financeiro', value: 32 },
      { name: 'Marketing', value: 15 }
    ];

    this.priorityData = [
      { name: 'Alta', value: 38 },
      { name: 'Média', value: 52 },
      { name: 'Baixa', value: 30 }
    ];

    this.timeSeriesData = [
      { name: 'Jan', concluidas: 20, emAndamento: 45, pendentes: 35 },
      { name: 'Fev', concluidas: 25, emAndamento: 55, pendentes: 40 },
      { name: 'Mar', concluidas: 30, emAndamento: 50, pendentes: 38 },
      { name: 'Abr', concluidas: 40, emAndamento: 45, pendentes: 32 },
      { name: 'Mai', concluidas: 35, emAndamento: 40, pendentes: 30 },
      { name: 'Jun', concluidas: 45, emAndamento: 35, pendentes: 25 }
    ];
  }

  renderizarGraficoPizza(): void {
    const ctx = document.getElementById('graficoPizza') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Concluídas', 'Em Andamento', 'Pendentes'],
        datasets: [{
          data: [
            this.demandaSummary.concluidas,
            this.demandaSummary.emAndamento,
            this.demandaSummary.pendentes
          ],
          backgroundColor: [
            this.chartColors.concluidas,
            this.chartColors.emAndamento,
            this.chartColors.pendentes
          ],
          borderColor: [
            this.chartColors.borderConcluidas,
            this.chartColors.borderEmAndamento,
            this.chartColors.borderPendentes
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Distribuição de Demandas por Status'
          }
        }
      }
    });
  }

  renderizarGraficoBarras(): void {
    const ctx = document.getElementById('graficoBarras') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Concluídas', 'Em Andamento', 'Pendentes'],
        datasets: [{
          label: 'Quantidade de Demandas',
          data: [
            this.demandaSummary.concluidas,
            this.demandaSummary.emAndamento,
            this.demandaSummary.pendentes
          ],
          backgroundColor: [
            this.chartColors.concluidas,
            this.chartColors.emAndamento,
            this.chartColors.pendentes
          ],
          borderColor: [
            this.chartColors.borderConcluidas,
            this.chartColors.borderEmAndamento,
            this.chartColors.borderPendentes
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Demandas por Status'
          }
        }
      }
    });
  }

  renderizarGraficoLinha(): void {
    const ctx = document.getElementById('graficoLinha') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.timeSeriesData.map(item => item.name),
        datasets: [
          {
            label: 'Concluídas',
            data: this.timeSeriesData.map(item => item.concluidas),
            borderColor: this.chartColors.borderConcluidas,
            backgroundColor: this.chartColors.concluidas,
            tension: 0.4,
            fill: false
          },
          {
            label: 'Em Andamento',
            data: this.timeSeriesData.map(item => item.emAndamento),
            borderColor: this.chartColors.borderEmAndamento,
            backgroundColor: this.chartColors.emAndamento,
            tension: 0.4,
            fill: false
          },
          {
            label: 'Pendentes',
            data: this.timeSeriesData.map(item => item.pendentes),
            borderColor: this.chartColors.borderPendentes,
            backgroundColor: this.chartColors.pendentes,
            tension: 0.4,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Quantidade'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Mês'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Evolução de Demandas ao Longo do Tempo'
          }
        }
      }
    });
  }

  renderizarGraficoDepartamentos(): void {
    const ctx = document.getElementById('graficoDepartamentos') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.departmentData.map(item => item.name),
        datasets: [{
          data: this.departmentData.map(item => item.value),
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(75, 192, 192, 0.7)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Demandas por Departamento'
          }
        }
      }
    });
  }

  renderizarGraficoPrioridades(): void {
    const ctx = document.getElementById('graficoPrioridades') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: this.priorityData.map(item => item.name),
        datasets: [{
          data: this.priorityData.map(item => item.value),
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(255, 205, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Demandas por Prioridade'
          }
        }
      }
    });
  }

  buscarDadosDemandas(): void {

  }

  onFilterChange(): void {
  }

  onPeriodChange(): void {
  }

  getSeveridadeClass(severidade: string): string {
    switch (severidade) {
      case 'alta': return 'severidade-alta';
      case 'media': return 'severidade-media';
      case 'baixa': return 'severidade-baixa';
      default: return '';
    }
  }
}